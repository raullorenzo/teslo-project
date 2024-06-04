'use client'

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link"
import { authenticate } from "@/actions";
import clsx from "clsx";
import { IoInformationOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export const LoginForm = () => {

  const router = useRouter();
  const [status, dispatch] = useFormState(authenticate, undefined);

  useEffect(() => {
    if (status === 'Success') {
      // router.replace('/');
      window.location.replace('/');
    }
  }, [router, status]);  

  return (
    <form action={dispatch} className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        name="email"
        type="email" />

      <label htmlFor="email">Contraseña</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        name="password"
        type="password"
      />

      <div
        className="flex h-8 items-end space-x-1"
        aria-live="polite"
        aria-atomic="true"
      >
        {(status && status !== 'Success' && status !== undefined) && (
          <div className=" flex mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{status}</p>
          </div>
        )}
      </div>

      {/* <button
        type="submit"
        className="btn-primary">
        Ingresar
      </button> */}
      <LoginButton />

      {/* divisor l ine */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link
        href="/auth/new-account"
        className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>

    </form>
  )
}

function LoginButton() {
  const { pending } = useFormStatus();
 
  return (
    <button
      type="submit"
      className={
        clsx({
          "btn-primary": !pending,
          "btn-disabled": pending
        })
      }>
      Ingresar
    </button>
  );
}