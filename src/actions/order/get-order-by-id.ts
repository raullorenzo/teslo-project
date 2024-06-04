'use server'

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderById = async (id: string) => {

  const session = await auth();

  if (!session) {
    return {
      ok: false,
      message: 'User not authenticated',
    };
  }

  try {
    // Get the order by id
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            size: true,
            product: {
              select: {
                title: true,
                slug: true,
                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                }
              }
            }
          }
        }
      }
    });

    if (!order) {
      throw new Error(`Order with id: ${id} not found`);
    }

    if (session.user.role === 'user') {
      if (order.userId !== session.user.id) {
        throw new Error(`You don't have permission to view this order, ${id} is not yours`);
      }
    }

    return {
      ok: true,
      order,
    };

  } catch (error) {
    console.log('Error getting the order', error);
    
    return {
      ok: false,
      message: 'The order does not exist',
    };
  }

}