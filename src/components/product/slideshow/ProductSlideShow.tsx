'use client'

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperObject } from 'swiper';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import './slideshow.css';
import { ProductImage } from '@/components';

interface ProductSlideShowProps {
  images: string[];
  title: string;
  className?: string;
}

export const ProductSlideShow = ({ images, title, className }: ProductSlideShowProps) => {

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();

  return (
    <div className={className}>
      <Swiper
        style={{
          // width: '50vw',
          height: 'fit-content',
          // '--swiper-navigation-size': '50px',
          '--swiper-navigation-color': '#858689',
          '--swiper-pagination-color': '#858689',
        } as React.CSSProperties
      }
        spaceBetween={10}
        navigation={true}
        autoplay={{ delay: 3000 }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
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
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
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
