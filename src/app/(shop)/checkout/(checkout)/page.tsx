import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCartCheckout } from "./ui/ProductsInCartCheckout";
import { PlaceOrder } from "./ui/PlaceOrder";

export default function CheckoutPage() {
  
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title='Verificar pedido' />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          
          {/* Cart */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Resumen del pedido</span>
            <div className="flex flex-row">
              <Link href="/cart" className="mb-5 mr-5 bg-blue-500 text-white py-2 px-5 rounded mt-5 block text-center w-full hover:bg-blue-600">
                Editar pedido
              </Link>
              <Link href="/checkout/address" className="mb-5 bg-blue-500 text-white py-2 px-5 rounded mt-5 block text-center w-full hover:bg-blue-600">
                Editar dirección
              </Link>
            </div>

            {/* Items */}
            <ProductsInCartCheckout />
          </div>
          
          {/* Summary */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  );
}