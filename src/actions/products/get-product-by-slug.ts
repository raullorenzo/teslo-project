'use server'

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findFirst({
      include: {
        ProductImage: true,
      },
      where: {
        slug,
      },
    });

    if (!product) return null;

    // Exclude ProductImage from the rest of the product object
    // const { ProductImage, ...rest } = product;

    return {
      ...product,
      images: product!.ProductImage.map((image) => image.url),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error getting product by slug');
  }
}