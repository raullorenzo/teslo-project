'use server';

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    // Verifica si la dirección del usuario existe
    const userAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (!userAddress) {
      return {
        ok: false,
        message: 'Address not found',
      };
    }

    // Si existe, elimina la dirección
    await prisma.userAddress.delete({
      where: {
        userId,
      },
    });

    return {
      ok: true,
      message: 'Address deleted',
    };
  } catch (error) {
    console.log('Cannot delete address', error);
    
    return {
      ok: false,
      message: 'Cannot delete address',
    }
  }
};
