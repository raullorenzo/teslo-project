import { Footer, Sidebar, TopMenu } from '@/components';

export default function ShopLayout({ children }: {
 children: React.ReactNode;
}) {

  return (
    <main className='min-h-screen'>
      <TopMenu />
      <Sidebar />

      <div className='sm:px-10 md:px-20 lg:px-30 xl:px-40'>
        { children }
      </div>

      <Footer />
    </main>
  );
}