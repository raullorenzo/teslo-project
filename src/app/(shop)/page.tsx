export const revalidate = 60;

import { Pagination, ProductGrid, Title } from '@/components';
import { getPaginatedProductsWithImages } from '@/actions';
import { redirect } from 'next/navigation';

interface HomePageProps {
  searchParams: {
    page?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, /*take: 12*/ });

  if (products.length === 0) redirect('/');

  return (
    <>
      <Title
        title='Tienda'
        subtitle='Todos los productos'
        className='mb-2 px-2'
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
 