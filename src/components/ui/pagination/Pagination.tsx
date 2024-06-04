'use client'

import { generatePaginationNumbers } from "@/utils";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import clsx from "clsx";
import Link from "next/link";

interface PaginationProps {
  totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {

  const pathName = usePathname();
  const searchParams = useSearchParams();
  const pageString = searchParams.get('page') ?? 1;
  const isNotaNumber = isNaN(+pageString);
  const currentPage = isNotaNumber ? 1 : +pageString;
  
  // cambiamos la url si la pagina no es un numero, y si es menor a 1
  if (currentPage < 1 || isNotaNumber) {
    redirect(`${pathName}?page=1`);
  }
  
  // cambiamos la url si no hay parametro page ??? RLM
  // if (!searchParams.get('page')) {
  //   redirect(`${pathName}?page=1`);
  // }
  
  const allPages = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);

    if (pageNumber === '...') {
      return `${pathName}?${params.toString()}`;
    }

    if (+pageNumber <= 0) {
      return `${pathName}`; // href='/' href='/men'
    }

    if (+pageNumber > totalPages) { // Next >
      return `${pathName}?${params.toString()}`; // nos quedamos en la misma página
    }

    params.set('page', pageNumber.toString());

    return `${pathName}?${params.toString()}`;
  }

  return (
    // mostrar solo si hay mas de una página
    totalPages <= 1 ? null :
    <div className='flex justify-center mt-10 mb-32'>
      <nav aria-label='Page navigation example'>
        <ul className='flex list-style-none'>
          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'
              href= {createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {
            allPages.map((page, index) => (
              <li key={index} className='page-item'>
                <Link
                  className={
                    clsx(
                      'page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none',
                      {
                        'bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700': page === currentPage
                      }
                    )
                  }
                  href= {createPageUrl(page)}
                >
                  {page}
                </Link>
              </li>
            ))
          }
  
          <li className='page-item'>
            <Link
              className='page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none'
              href= {createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
