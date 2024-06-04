import { initialData } from "./seed";
import prisma from '../lib/prisma';
import { countries } from "./seed-countries";

async function main() {

  // Delete previous tables
  // await Promise.all([
  //   prisma.productImage.deleteMany(),
  //   prisma.product.deleteMany(),
  //   prisma.category.deleteMany(),
  // ]);

  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Categories
  // One category
  // await prisma.category.createMany({ 
  //   data: {
  //     name: 'Shirts'
  //   }
  // });

  // Multiple categories
  const { categories, products, users } = initialData;

  await prisma.user.createMany({ data: users });

  await prisma.country.createMany({ data: countries });

  const categoriesData = categories.map((name) => ({ name: name.toString() }));
  await prisma.category.createMany({ data: categoriesData });

  const categoriesDb = await prisma.category.findMany();
  const categoriesMap = categoriesDb.reduce((map, category) => {
    map[category.name.toLocaleLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>); //<string= shirt, string=categoryID>
  

  // Products
  products.forEach(async (product) => {
    const { type, images, ...rest } = product;
    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Images
    const imagesData = images.map(image => ({
      url: image,
      productId: dbProduct.id,
    }));
    
    await prisma.productImage.createMany({ data: imagesData });

  // products.forEach(async (product) => {
  //   const { type, images, ...rest } = product;
  //   const category = categoriesMap[type];
  //   const productData = { ...rest, categoryId: category };
  //   const productDb = await prisma.product.create({ data: productData });

  //   Product Images
  //   const imagesData = images.map((url) => ({
  //     url,
  //     productId: productDb.id,
  //   }));
  //   await prisma.productImage.createMany({ data: imagesData });
    
  });

  console.log('Seed executed successfully!');
  
}


(async () => {
  if (process.env.NODE_ENV == 'production') return;

  await main();
})();