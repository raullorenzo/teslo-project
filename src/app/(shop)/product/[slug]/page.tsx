export const revalidate = 604800; // 7 days

import { getProductBySlug } from "@/actions";
import {
  ProductMobileSlideShow,
  ProductSlideShow,
  StockLabel
} from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";
import { currencyFormat } from "@/utils";

interface ProductPageProps {
  params: {
    slug: string;
  };
  searchParams: URLSearchParams;
}

export async function generateMetadata(
  { params, searchParams }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug
 
  // fetch data
  // const product = await fetch(`https://.../${id}`).then((res) => res.json())
  const product = await getProductBySlug(slug);
 
  // optionally access and extend (rather than replace) parent metadata
  // const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: product?.title ?? 'Product not found',
    description: product?.description ?? 'This product is not available',
    openGraph: {
      title: product?.title ?? 'Product not found',
      description: product?.description ?? 'This product is not available',
      // images: [], // https://misitioweb.com/product/123
      images: [`/products/${product?.images[1]}`]
    },
  }
}

export default async function ProductBySlugPage({ params }: ProductPageProps) {

  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      { /* Slide show */ }
      <div className="col-span-1 md:col-span-2">

        { /* Mobile SlideShow */ }
        <ProductMobileSlideShow
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

        { /* Desktop SlideShow */ }
        <ProductSlideShow
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
      </div>

      { /* Product Info */ }
      <div className="col-span-1 px-5">
        
        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{currencyFormat(product.price)}</p>

        <AddToCart product={product} />

        { /* Description */ }
        <h3 className="font-bold text-sm ">
          Description
        </h3>
        <p className="font-light">
          {product.description}
        </p>

      </div>
    </div>
  );
}