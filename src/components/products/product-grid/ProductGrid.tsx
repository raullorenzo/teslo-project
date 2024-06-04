import { Product } from "@/interfaces";
import { ProductGridItem } from "./ProductGridItem";

interface ProductGridProps {
  products: Product[],
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-2 px-2 sm:grid-cols-3 gap-10 mb-10">
      {
        products.map((product) => (
         <ProductGridItem key={product.slug} product={product} />
        ))
      }
    </div>
  )
}
