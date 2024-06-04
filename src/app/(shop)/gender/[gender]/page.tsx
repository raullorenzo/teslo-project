export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";
// import { notFound } from "next/navigation";

interface CategoryProps {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function GenderPage({ params, searchParams }: CategoryProps) {

  const { gender } = params;

  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({
    page,
    /*take: 12*/
    gender: gender as Gender
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  const lables: Record<string, string> = {
    'men': 'para hombres',
    'women': 'para mujeres',
    'kid': 'para niños',
    'unisex': 'para todos'
  }
  const subtitle: Record<string, string> = {
    'men': 'para él',
    'women': 'para ella',
    'kid': 'para ellos',
    'unisex': 'para todos'
  };

  // if (id === 'kids') {
  //   notFound();
  // }

  return (
    <>
      <Title
        title={`Artículos de ${lables[gender]}`}
        subtitle={`Todos los productos ${subtitle[gender]}`}
        className='mb-2'
      />

      <ProductGrid products={ products } />

      <Pagination totalPages={totalPages} />
    </>
  );
}