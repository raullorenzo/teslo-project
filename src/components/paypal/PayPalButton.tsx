'use client'

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { paypalCheckPayment, seTransactionId } from '@/actions';

interface PayPalButtonProps {
  orderId: string;
  amount: number;
}

export const PayPalButton = ({orderId, amount}: PayPalButtonProps) => {

  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100; // 2 decimales

  if (isPending) {
    return (
      <div>
        <div className='animate-pulse mb-14'>
          <div className='h-11 bg-gray-300 rounded'></div>
          <div className='h-11 bg-gray-500 rounded mt-3.5'></div>
        </div>
      </div>
    );
  }

  const createOrder = async(data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
    const transactionId = await actions.order.create({
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: 'EUR',
          },
        },
      ],
      intent: 'CAPTURE'
    });
    
    const {ok} = await seTransactionId(orderId, transactionId);
    if (!ok) {
      throw new Error('Cannot update the order');
    }

    return transactionId;
  };

  const onApprove = async(data: OnApproveData, actions: OnApproveActions) => {
    
    const details = await actions.order?.capture();

    if (!details) {
      return;
    }

    await paypalCheckPayment(details.id!); // Provide a default value for the argument

  };

  return (
    <div className='relative z-0'>
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
      />
    </div>
  )
}
