'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './slideshow.css';
import { ProductImage } from '@/components';

interface ProductMobileSlideShowProps {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideShow = ({ images, title, className }: ProductMobileSlideShowProps) => {

  return (
    <div className={className}>
      <Swiper
        style={{
          width: '100vw',
          height: '500px',
          '--swiper-navigation-color': '#858689',
          '--swiper-pagination-color': '#858689',
        } as React.CSSProperties
      }
        pagination={true}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >
        {
          images.length === 0 ? 
            <SwiperSlide>
              <Image
                src="/imgs/placeholder.jpg"
                width={200}
                height={200}
                alt="No image"
                className="rounded-lg object-fill"
              />
            </SwiperSlide>
          : images.map(image => (
            <SwiperSlide key={image}>
              <ProductImage
                src={image}
                width={1024}
                height={800}
                alt={title}
                className="rounded-lg object-fill"
              />
            </SwiperSlide>
          ))
        }
      </Swiper>
    </div>
  )
}
