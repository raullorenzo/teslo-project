'use client'

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const OrderSummary = () => {

  const router = useRouter();

  const [loaded, setLoaded] = useState(false);
  const { itemsInCart, subtotal, total, tax } = useCartStore(state => state.getSummaryInformation());

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if ( itemsInCart === 0 && loaded === true )   {
      router.replace('/empty')
    }
  },[itemsInCart, loaded, router])

  if (!loaded) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-2">
      <span>Nº de productos</span>
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
  )
}
