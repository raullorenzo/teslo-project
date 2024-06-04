'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

  // Autenticación del usuario
  const session = await auth();
  const userId = session?.user.id;

  // Verificar si el usuario está autenticado
  if (!userId) {
    return {
      ok: false,
      message: "User not found",
    };
  }

  // Obtener la información de los productos solicitados
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map(p => p.productId),
      },
    },
  });

  // Verificar si hay suficiente stock antes de proceder
  for (const product of productIds) {
    const productInDb = products.find(p => p.id === product.productId);
    const totalQuantity = productIds
      .filter(p => p.productId === product.productId)
      .reduce((acc, p) => acc + p.quantity, 0);

    if (productInDb && productInDb.inStock < totalQuantity) {
      return {
        ok: false,
        message: `Product ${productInDb.title} has insufficient stock`,
      };
    }
  }

  // Calcular el número total de productos en la orden
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  // Calcular los totales de la orden: subtotal, impuesto y total
  const {subtotal, tax, total} = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((product) => product.id === item.productId);

      if (!product) throw new Error(`${item.productId} no existe - 500`);

      const subtotal = product.price * productQuantity;

      totals.subtotal += subtotal;
      totals.tax += subtotal * 0.15;
      totals.total += subtotal * 1.15;

      return totals;
    },
    { subtotal: 0, tax: 0, total: 0 }
  );

  // Crear la transacción en la base de datos
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        //  Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity // no hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar si algún producto tiene stock negativo después de la actualización
      updatedProducts.forEach(product => {
        if (product.inStock < 0) {
          throw new Error(`Product ${product.title} has no stock`);
        }
      });

      // 2. Crear la orden - encabezado y detalle
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder,
          subtotal,
          tax,
          total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          }
        }
      });

      // 3. Crear la dirección de envío
      const {country, ...restAddress} = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        }
      });

      return {
        updatedProducts,
        order,
        orderAddress,
      }
    });

    return {
      ok: true,
      message: "Order created successfully",
      order: prismaTx.order,
      prismaTx
    };
  } catch (error: any) {
    console.error(error);
    return {
      ok: false,
      message: `Error creating the order ${error.message}`,
    };
  }
}
