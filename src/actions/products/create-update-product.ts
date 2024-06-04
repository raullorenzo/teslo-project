'use server'

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {v2 as cloudinary} from 'cloudinary';

// cloudinary.config(process.env.CLOUDINARY_URL ?? '');
cloudinary.config(process.env.CLOUDINARY_URL ?? '');

// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce
    .string()
    .transform((val) => val.split(',').map((size) => size.trim())),
  tags: z.string(),
  gender: z.nativeEnum(Gender)
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    
    return {
      ok: false,
      error: `Invalid data: ${productParsed.error.errors.join(', ')}`
    };
  }

  const product = productParsed.data;

  product.slug = product.slug.toLowerCase().replace(/ /g, '-').trim().toLocaleLowerCase();

  // Save the product in the database
  const {id, ...rest} = product;

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {

      let product: Product;
      const tagsArray = rest.tags.split(',').map((tag) => tag.trim().toLocaleLowerCase());
      if (id) {
        // Update product
        product = await prisma.product.update({
          where: {id},
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[]
            },
            tags: {
              set: tagsArray
            }
          }
        });
      } else {
        // Create product
        product = await prisma.product.create({
          data: {
            ...rest,
            sizes: {
              set: rest.sizes as Size[]
            },
            tags: {
              set: tagsArray
            }
          }
        });
      }

      // Save images
      // Recorrer las imganes y guardarlas

      if (formData.getAll('images')) {
        console.log(formData.getAll('images'));
        // [https://url.jpg, https://url2.jpg]
        const images = await uploadImages(formData.getAll('images') as File[]);

        console.log(images);
        if ( !images ) {
          throw new Error('Cannot upload images, rollback transaction');
        }

        await prisma.productImage.createMany({
          data: images.map( image => ({
            url: image!,
            productId: product.id,
          }))
        });
      }


      return {
        product,
      };
    });    

    // TODO: revalidatePaths
    revalidatePath('/admin/products');
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      message: id ? 'Product updated successfully' : 'Product created successfully',
      product: prismaTx.product
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: id ? 'Error updating the product' : 'Error creating the product'
    };
  }
}

// const uploadImages = async (images: File[]) => {
//   try {
//     const uploadPromises = images.map(async (image) => {
//       try {
//         const buffer = await image.arrayBuffer();
//         const base64Image = Buffer.from(buffer).toString('base64');
//         console.log(`Uploading image: ${image.name}`);  // Registra el nombre de la imagen
//         return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then(res => res.secure_url);
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         return null;
//       }
//     });

//     const uploadedImages = await Promise.all(uploadPromises);
//     console.log('Uploaded images:', uploadedImages);  // Registra las imágenes subidas
//     return uploadedImages;
//   } catch (error) {
//     console.error('Error in uploadImages:', error);
//     return null;
//   }
// };


const uploadImages = async (images: File[]) => {
  try {

    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');

        return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then(res => res.secure_url);

      } catch (error) {
        console.error(error);

        return null;
      }
    }); 

    const uploadedImages = await Promise.all(uploadPromises);

    return uploadedImages;

  } catch (error) {
    console.error(error);

    return null;
  }
}
