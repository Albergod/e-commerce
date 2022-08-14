import Link from "next/link";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "./data/error";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  async function submitHandler({ email, password }) {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
      return result;
    } catch (error) {
      toast.error(getError(error));
    }
  }
  return (
    <Layout>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Ingresar</h1>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            className='w-full p-3 bg-slate-100'
            id='email'
            placeholder='Escribe tu email'
            autoFocus
            {...register("email", {
              required: "Por favor ingrese un email",
              pattern: {
                value:
                  /^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$/i,
                message: "Por favor inserte un email válido",
              },
            })}
          />
          {errors.email && (
            <div className='text-red-500 '>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Contraseña</label>
          <input
            type='password'
            className='w-full p-3 bg-slate-100'
            id='password'
            placeholder='escribe tu constraseña'
            autoFocus
            {...register("password", {
              required: "por favor introduzca una contraseña",
              minLength: {
                value: 6,
                message: "La contraseña debe tener almenos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-10'>
          <button className='primary-button'>Ingresar</button>
        </div>
        <div className='mb-5'>¿No tienes cuenta? &nbsp;</div>
        <Link href={`/register?redirect=${redirect || "/"}`}>Registrar</Link>
      </form>
    </Layout>
  );
};

export default Login;
