'use server'

import prisma from "@/lib/prisma";


export const getCountryById = async (countryId: string) => {
  // Get the country by id
  const country = await prisma.country.findUnique({
    where: {
      id: countryId
    }
  });

  if (!country) {
    return {
      ok: false,
      message: 'Country not found',
    };
  }

  return {
    ok: true,
    country,
  };
}
