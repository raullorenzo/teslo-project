'use client'

import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { Title } from "@/components";
import { OrderSummary } from "./ui/OrderSummary";
import { IoCartOutline } from "react-icons/io5";


export default function CartPage() {

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title='Carrito' />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Cart */}
          <div className="flex flex-col w-full mt-5">
            {/* <span className="text-xl">Estado de tu carrito</span> */}
            <Link href="/" className="mb-5 bg-blue-500 text-white py-2 px-5 rounded mt-5 block text-center w-full sm:w-11/12 hover:bg-blue-600">
              Continúa comprando
              <IoCartOutline className="inline-block ml-4" />
            </Link>

            {/* Items */}
            <ProductsInCart />

          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow-xl p-7 h-fit my-5">
            <h2 className="text-2xl mb-2">Resumen del pedido</h2>

            <OrderSummary />
            <div>
              <Link
                className="bg-black text-white py-2 px-5 rounded mt-5 block text-center w-full hover:bg-gray-600"
                href="/checkout/address">Checkout</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}