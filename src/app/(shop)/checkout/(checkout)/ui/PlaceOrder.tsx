'use client'

import { getCountryById, placeOrder } from "@/actions";
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from "@/utils"
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { IoAlertCircleOutline } from "react-icons/io5";

export const PlaceOrder = () => {

  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, seterrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [countryName, setCountryName] = useState('');

  const address = useAddressStore(state => state.address);

  const { itemsInCart, subtotal, total, tax } = useCartStore(state => state.getSummaryInformation());

  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const fetchCountryName = async () => {
      if (address && address.country) {
        try {
          const countryResponse = await getCountryById(address.country);
          const { country } = countryResponse;
          setCountryName(country?.name || '');
        } catch (error) {
          console.error('Error fetching country name', error);
        }
      }
    };

    fetchCountryName();
    setLoaded(true);
  }, [address]);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map(product => ({
      productId: product.id, // Add the productId property
      quantity: product.quantity,
      size: product.size,
    }));

    //! Create the order server action
    if (productsToOrder.length > 0) {
      const resp = await placeOrder(productsToOrder, address);

      if (!resp.ok) {
        setIsPlacingOrder(false);
        seterrorMessage(resp.message);
        console.error('Error creating the order', resp.message);

        return;
      }

      //* Todo salio bien si llegamos aquí
      clearCart();
      router.replace(`/orders/${resp.order!.id}`);
    }
  }

  if (!loaded) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      {
        itemsInCart === 0 && (
          <p className="text-xl font-bold">No hay productos en el carrito</p>
        )
      }
      {
        itemsInCart > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address}</p>
              <p>{address.address2}</p>
              <p>{address.postalCode}</p>
              <p>{address.city}, {countryName}</p>
              <p>{address.phone}</p>
            </div>

            {/* Divider */}
            <hr className="my-5" />

            <h2 className="text-2xl font-bold mb-2">Resumen del pedido</h2>
            <div className="grid grid-cols-2">
              <span className="tex-2xl">Nº de productos</span>
              <span className="text-right">
                {itemsInCart === 1 ? '1 producto' : `${itemsInCart} productos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(subtotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
            </div>
            <div>

              { /* Error message */}
              {
                errorMessage && (
                  <p className="flex bg-red-500 text-white text-xs py-2 px-2 mt-5 mb-5 font-bold rounded-md">
                    <IoAlertCircleOutline size={30} className="text-white text-2xl mr-2" />
                    {errorMessage}
                  </p>
                )
              }

              { /* Disclamer */}
              <p className="text-sm mt-5">
                Al hacer clic en <span className="font-bold">Crear pedido</span>, aceptas nuestros <a href="#" className="underline">términos y condiciones</a> y nuestra <a href="#" className="underline">política de privacidad</a>.
              </p>

              <button
                // href="/orders/123"
                onClick={onPlaceOrder}
                // className="bg-black text-white py-2 px-5 rounded mt-5 block text-center w-full"
                className={
                  clsx(
                    "bg-black text-white py-2 px-5 rounded mt-5 block text-center w-full",
                    { 'btn-disabled cursor-not-allowed': isPlacingOrder }
                  )
                }>
                Crear pedido
              </button>
            </div>
          </>
        )
      }

    </div>
  )
}
