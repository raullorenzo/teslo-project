'use client'

import { QuantitySelector, SizeSelector } from "@/components";
import type { CartProduct, Product, Size } from "@/interfaces";
import { useCartStore } from "@/store";
import { useState } from "react";

interface AddToCartProps {
  product: Product;
}

export const AddToCart = ({ product }: AddToCartProps) => {

  const addProductToCart = useCartStore(state => state.addProductToCart);

  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [quantity, setquantity] = useState<number>(1);
  const [posted, setposted] = useState<boolean>(false);

  const addToCart = () => {
    setposted(true);
    if (!selectedSize) return;

    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity,
      size: selectedSize,
      image: product.images[0]
    };

    addProductToCart(cartProduct);
    setposted(false);
    setquantity(1);
    setSelectedSize(undefined);
  }

  return (
    <>
      { /* Error message */}
      {
        posted && !selectedSize && (
          <span className="mt-2 text-red-500">
            Debe de seleccionar una talla
          </span>
        )
      }
      { /* Sizes */ }
        <SizeSelector
          selectedSize={selectedSize}
          avaliableSizes={product.sizes}
          onSizeChanged={setSelectedSize} // (size: Size) => setsize(size)
        />

        { /* Quantity */ }
        <QuantitySelector
          quantity={quantity}
          onQuantityChanged={setquantity} // (quantity: number) => setquantity(quantity)
        />

        { /* Add to cart */ }
        <button
          onClick={addToCart}
          className="btn-primary my-5">
          Add to Cart
        </button>
    </>
  )
}
