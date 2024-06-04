export const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  // Si el número total de páginas es 7 o menos
  // Vamos a mostrar todas las páginas sin suspensión
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1); // [1,2,3,4,5,6,7]
  }

  // Si la página actual está entre las primeras 3 páginas
  // Mostramos las primeras 3 páginas y luego 3 puntos suspensivos y las ultimas 2 páginas
  if (currentPage <= 3) {
    return [1, 2, 3,"...", totalPages - 1, totalPages]; // [1,2,3,...,9,10]
  }

  // Si la página actual está entre las últimas 3 páginas
  // Mostramos las primeras 2 páginas y luego 3 puntos suspensivos y las ultimas 3 páginas
  if (currentPage >= totalPages - 3) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages]; // [1,2,...,8,9,10]
  }

  // Si la página actual está en el medio
  // Mostramos la primera página, 3 puntos suspensivos, la página actual, 3 puntos suspensivos y vecinos
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]; // [1,...,4,5,6,...,10]
}
