'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store";
import { ProductImage, QuantitySelector } from "@/components";
import { currencyFormat } from "@/utils";
import { IoCloseSharp } from "react-icons/io5";


export const ProductsInCart = () => {

  const upddateProductQuantity = useCartStore(state => state.updateProductQuantity);
  const removeProduct = useCartStore(state => state.removeProduct);
  
  const [loaded, setLoaded] = useState(false);
  const productsInCart = useCartStore(state => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) return <div>Loading...</div>;

  return (
    <>
      {
        productsInCart.map(product => (
          <div key={`${product.slug}-${product.size}`} className="flex mb-5">
            <ProductImage
              src={product?.image}
              width={100}
              height={100}
              style={{
                width: '120px',
                height: '135px',
              }}
              alt={product.title}
              className="mr-5 rounded"
            />

            <div>
              <Link
                className="hover:underline cursor-pointer"
                href={`/product/${product.slug}`}
              >
                {product.size} - {product.title}
              </Link>
              {/* <p>{product.title}</p> */}
              <p className="font-bold">{currencyFormat(product.price)}</p>
              <QuantitySelector
                quantity={product.quantity}
                onQuantityChanged={
                  (quantity: number) => upddateProductQuantity(product, quantity)
                }
              />
              <button
                onClick={() => removeProduct(product)}
                className="underline mt-3">
                  <IoCloseSharp size={30} className="inline-block mr-2 text-red-500" />
                Eliminar 
              </button>
            </div>
          </div>
        ))
      }
    </>
  )
}
