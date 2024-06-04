import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return {
      ok: false,
      message: "Unauthorized",};
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });
  
    return {
      ok: true,
      users,
    };
  } catch (error) {
    console.error(error);
    
    return {
      ok: false,
      message: "Error getting users.",
    };
  }
};