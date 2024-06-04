'use client';

import clsx from "clsx";
import Link from "next/link";
import { signOut, useSession, signIn } from "next-auth/react";
import { useUIStore } from "@/store";
import {
  IoCalendarClearOutline,
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
  IoTrophyOutline
} from "react-icons/io5";
// import { logout } from "@/actions";

export const Sidebar = () => {

  const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
  const closeMenu = useUIStore(state => state.closeSideMenu);

  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.role === 'admin';
  
  return (
    <div>
      {/* Background black */}
      {
        isSideMenuOpen && (
          <div
          className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30">
        </div>
        )
      }
     
      {/* Blur */}
      {
        isSideMenuOpen && (
          <div
            onClick={ closeMenu }
            className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm">
          </div>
        )
      }

      {/* Sidebar */}
      <nav
        // onClick={ closeMenu }
        className={
          clsx(
            "fixed p-5 right-0 top-0 w-full sm:w-2/4 h-screen bg-white shadow-xl transform transitiin-all duration-300 z-20",
            {
              "translate-x-full": !isSideMenuOpen,
            }
          )
        }>

        <IoCloseOutline
          size={50}
          className="cursor-pointer absolute top-5 right-5"
          onClick={ closeMenu }
        />

        {/* Sidebar content input search */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full h-10 pl-10 pr-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sidebar menu options */}
        <div onClick={ closeMenu }>
          {isAuthenticated && (
            <>
            <Link
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              href="/profile">
              <IoPersonOutline size={25} />
              <span className="ml-3 test-xl">Perfil</span>
            </Link>
              <Link
                className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                href="/orders">
                <IoTicketOutline size={25} />
                <span className="ml-3 test-xl">Pedidos</span>
              </Link>
              <button
                className="flex w-full items-center mt-10 p-2 hover:bg-red-600 hover:text-white rounded transition-all"
                onClick={() => signOut()}
                // onClick={
                //   () => {
                //     'use server'
                //   }
                // }
              >
                <IoLogOutOutline size={25} />
                <span className="ml-3 test-xl">Salir</span>
              </button>
            </>
          )}
          {!isAuthenticated && (
            <button
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => signIn()}
              // href="/auth/login"
              >
              <IoLogInOutline size={25} />
              <span className="ml-3 test-xl">Entrar</span>
            </button>
          )}

          {/* Sidebar line separator */}
          <div className="w-full h-px bg-gray-200 my-10" />

          {/* Sidebar menu options */}
          {
            isAdmin && (
              <>
                <Link
                  className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  href="/admin/orders">
                  <IoCalendarClearOutline size={25} />
                  <span className="ml-3 test-xl">Órdenes</span>
                </Link>
                <Link
                  className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  href="/admin/users">
                  <IoPeopleOutline size={25} />
                  <span className="ml-3 test-xl">usuarios</span>
                </Link>
                <Link
                  className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  href="/admin/products">
                  <IoShirtOutline size={25} />
                  <span className="ml-3 test-xl">Productos</span>
                </Link>
                <Link
                  className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
                  href="/">
                  <IoTrophyOutline size={25} />
                  <span className="ml-3 test-xl">Top</span>
                </Link>
              </>
            )
          }
          
        </div>
      </nav>
    </div>
  )
}
