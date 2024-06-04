'use client'

import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts"
import { useEffect, useState } from "react";

interface StockLabelProps {
  slug: string;
}

export const StockLabel = ({ slug }: StockLabelProps) => {

  const [stock, setStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    getStock();
  },
    // []
  );

  const getStock = async () => {
    const inStock = await getStockBySlug(slug);
    setStock(inStock);
    setIsLoading(false);
  };

  return (
    <>
    {isLoading ? (
      <h1 className={`${titleFont.className} antialiased font-bold text-md bg-gray-200 animate-pulse`}>
      &nbsp;
    </h1>
    ) : (
      <h1 className={`${titleFont.className} antialiased font-bold text-md`}>

        {stock < 1 ? (
          <span className="text-red-500">Sin Stock</span>
        ) : (
          <span className="text-green-500">En stock ({stock})</span>
        )}        
      </h1>
    )}
    </>
  );
};
