'use server';

import type { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPayPalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: 'Cannot get the token',
    };
  }

  const result = await verifyPayPalPayment(paypalTransactionId, authToken);

  if (!result) {
    return {
      ok: false,
      message: 'Cannot verify the payment',
    };
  }

  const { status, purchase_units } = result;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== 'COMPLETED') {
    return {
      ok: false,
      message: 'Payment not completed',
    };
  }

  // !Realizar la actualización de la orden en la base de datos
  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    // !Revalidar un path
    revalidatePath(`/orders/${orderId}`);

    return {
      ok: true,
      message: 'Payment completed',
    };
    
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'Cannot update the order',
    };
  }
  
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL;

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    'utf-8'
  ).toString('base64');
  
  const myHeaders = new Headers();
  myHeaders.append("Accept-Language", "en_US");
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization", 
    `Basic ${base64Token}`
  );

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url!, {
      ...requestOptions,
      cache: "no-store",
    });
    const data = await result.json();

    return data.access_token;
  } catch (error) {
    console.error(error);

    return null;
  }

  // fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PaypalOrderStatusResponse | null> => {
  const paypalOrdersUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization", 
    `Bearer ${bearerToken}`
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const result = await fetch(paypalOrdersUrl, {
      ...requestOptions,
      cache: "no-store",
    });
    const data = await result.json();

    return data;
  } catch (error) {
    console.error(error);

    return null;
  }

  // fetch(paypalOrdersUrl, requestOptions)
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.error(error));
};