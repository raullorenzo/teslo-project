import Image from 'next/image';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
  style?: React.StyleHTMLAttributes<HTMLImageElement>['style'];
  width: number;
  height: number;
}

export const ProductImage = ({
  src,
  alt,
  className,
  style,
  width,
  height
}: ProductImageProps) => {

  const localSrc = (src) 
    ? src.startsWith('http') // https://urlcompletodelaimagen.jpg
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

    console.log(localSrc);
    

  return (
    <Image
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
    />
  );
};
