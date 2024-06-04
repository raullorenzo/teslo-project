'use server'

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
}: PaginationOptions) => {

  if (isNaN(Number(page)) ) page = 1;
  if (page < 1) page = 1;
  if (isNaN(Number(take)) ) take = 12;
  if (take < 1) take = 12;

  try {
    //1 Get products
    const products = await prisma.product.findMany({
      take,
      skip: (page - 1) * take,
      include: {
        ProductImage: {
          take: 2,
          select: {
            url: true,
          }, 
        }
      },
      // gender
      where: {
        gender
      }
    });

    //2 Get total pages
    // todo:
    const totalProducts = await prisma.product.count({
      where: {
        gender
      }
    });
    
    const totalPages = Math.ceil(totalProducts / take);

    return {
      currentPage: page,
      totalPages: totalPages,
      products: products.map((product) => ({
        ...product,
        images: product.ProductImage.map((image) => image.url),
      })),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error getting paginated products with images');
  }
};
