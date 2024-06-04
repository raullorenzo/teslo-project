import { Size } from "@/interfaces"
import clsx from "clsx";

interface SizeSelectorProps {
  selectedSize?: Size;
  avaliableSizes: Size[]; // ['S', 'M', 'L', 'XL']

  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ selectedSize, avaliableSizes, onSizeChanged}: SizeSelectorProps) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>

      <div className="flex">
        {avaliableSizes.map(size => (
          <button
            key={size}
            onClick={() => onSizeChanged(size)}
            className={
              clsx(
                `w-[50px] m-2 p-2 rounded-md transition-all hover:bg-gray-300 ${selectedSize === size ? 'bg-gray-100' : ''}`,
                {'bg-gray-300': size === selectedSize}
              )
            }
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  )
}
