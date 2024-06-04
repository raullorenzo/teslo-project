
import { OrderStatus, PayPalButton, ProductImage, Title } from "@/components";
import Image from "next/image";
import { currencyFormat } from "@/utils";
import { getCountryById, getOrderById } from "@/actions";
import { redirect } from "next/navigation";


interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {

  const { id } = params;

  // TODO: Llamar a la función getOrderById server action
  const { ok, order } = await getOrderById(id);

  if (!ok) {
    redirect('/');
  }

  const address = order!.OrderAddress;
  const countryResponse = await getCountryById(address!.countryId);
  const { country } = countryResponse;
  const countryName = country?.name;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Pedido #${id.split('-').at(-1)}`} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">

          {/* Cart */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={order?.isPaid ?? false} />

            {/* Items */}
            {
              order!.OrderItem.map(item => (
                <div key={item.product.slug + '-' + item.size} className="flex mb-5">
                  <ProductImage
                    src={item.product.ProductImage[0]?.url}
                    width={100}
                    height={100}
                    style={{
                      width: '100px',
                      height: '100px',
                    }}
                    alt={item.product.title}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{item.product.title}</p>
                    <p>{currencyFormat(item.price)} x {item.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Summary */}
          { }
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl font-bold mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address!}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>{address!.city}, {countryName}</p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}
            <hr className="my-5" />

            <h2 className="text-2xl font-bold mb-2">Resumen del pedido</h2>
            <div className="grid grid-cols-2">
              <span className="tex-2xl">Nº de productos</span>
              <span className="text-right">
                {order?.itemsInOrder === 1 ? '1 producto' : `${order?.itemsInOrder} productos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(order!.subtotal)}</span>

              <span>Impuestos (15%)</span>
              <span className="text-right">{currencyFormat(order!.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(order!.total)}</span>
            </div>
            <div className="mt-5 mb-2 w-full">
              {
                order?.isPaid ? (
                  <OrderStatus isPaid={order?.isPaid ?? false} />
                ) : (
                  <PayPalButton
                    orderId={order!.id}
                    amount={order!.total}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}