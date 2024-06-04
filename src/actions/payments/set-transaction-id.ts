'use server';

import prisma from "@/lib/prisma";

export const seTransactionId = async (orderId: string, transactionId: string) => {
  try {
    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        transactionId
      }
    });

    if (!order) {
      return {
        ok: false,
        message: `Order id:${orderId} not found`
      };
    }

    return {
      ok: true,
      order
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'Error while setting transaction id'
    }
  }
}
