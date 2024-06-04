'use client';

import { useState } from "react";
import { registerUser } from "@/actions";
import clsx from "clsx";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { login } from "@/actions";

type FormInputs = {
  name: string;
  email: string;
  password: string;
}

export const RegisterForm = () => {
  
  const [error, setError] = useState<string | null>(null);
  const {register, handleSubmit, formState: {errors}} = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data: FormInputs) => {
    setError(null);
    const { name, email, password } = data;

    // Server action
    const response = await registerUser(name, email, password);

    if (!response.ok) {
      setError(response.message);
      return console.log(response.message);
    }  
    
    await login(email.toLocaleLowerCase(), password);
    window.location.replace('/');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <label htmlFor="email">Nombre completo</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.name
              }
            )

          }
          type="text"
          autoFocus
          {...register('name', { required: true })}
        />

        <label htmlFor="email">Email</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.email
              }
            )
          }
          type="email"
          {
            ...register('email', { 
              required: true,
              pattern: /^\S+@\S+$/
            })
        }
        />

        <label htmlFor="password">Contraseña</label>
        <input
          className={
            clsx(
              "px-5 py-2 border bg-gray-200 rounded mb-5",
              {
                'border-red-500': errors.password
              }
            )
          }
          type="password"
          {
            ...register('password', {
              required: true,
              minLength: 6,
              // pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
              // regex 6 numbers.
              // pattern: /^(?=.*\d{6,})$/
            })
          }
        />

        <span className="text-red-500">{error}</span>

        <button
          className="btn-primary">
          Crear cuenta
        </button>


        {/* divisor line */ }
        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-gray-500"></div>
          <div className="px-2 text-gray-800">O</div>
          <div className="flex-1 border-t border-gray-500"></div>
        </div>

        <Link
          href="/auth/login" 
          className="btn-secondary text-center">
          Ingresar
        </Link>

      </form>
  )
}
