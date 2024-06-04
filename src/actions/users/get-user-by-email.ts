'use server'

import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLocaleLowerCase()
      }
    });

    return user
  } catch (error) {
    console.error(error);

    return null;
  }
}
