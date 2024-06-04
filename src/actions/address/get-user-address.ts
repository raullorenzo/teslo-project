'use server';

import prisma from "@/lib/prisma";

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    if (!address) {
      return {
        ok: false,
        message: 'Address not found',
      };
    }

    const { countryId, address2, ...rest} = address;

    return {
      ok: true,
      address: {
        ...rest,
        country: countryId,
        address2: address2 ?? '',
        city: 'Buenos Aires',
      },
    };
  } catch (error) {
    console.log('Cannot get address', error);
    
    return {
      ok: false,
      message: 'Cannot get address',
    }
  }
}
