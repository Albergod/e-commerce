import Link from "next/link";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "./data/error";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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
    getValues,
    formState: { errors },
  } = useForm();

  async function submitHandler({ name, email, password }) {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });
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
    console.log(name);
  }
  return (
    <Layout title={"Crea una cuenta"}>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Registrarse</h1>
        <div className='mb-4'>
          <label htmlFor='name'>Name</label>
          <input
            type='name'
            className='w-full p-3 bg-slate-100'
            id='name'
            placeholder='Escribe aquí tu nombre'
            autoFocus
            {...register("name", {
              required: "Por favor ingrese su nombre.",
              minLength: {
                value: 15,
                message: "Ingresa nombre y apellido por favor",
              },
            })}
          />
          {errors.name && (
            <div className='text-red-500 '>{errors.name.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            className='w-full p-3 bg-slate-100'
            id='email'
            placeholder='Escribe tu email'
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
        <div className='mb-4'>
          <label htmlFor='confirmP'>Confirmar</label>
          <input
            type='password'
            className='w-full p-3 bg-slate-100'
            id='confirmP'
            placeholder='confirmar contraseña'
            {...register("confirmP", {
              required: "por favor repita su contraseña.",
              validate: (value) => {
                value === getValues("password");
              },
              minLength: {
                value: 6,
                message: "Las contraseñas deben ser iguales.",
              },
            })}
          />
          {errors.confirmP && (
            <div className='text-red-500'>{errors.confirmP.message}</div>
          )}
          {errors.confirmP && errors.confirmP.type === "validate" && (
            <div className='text-red-500'>Las contraseñas no coinciden</div>
          )}
        </div>
        <div className='mb-10'>
          <button className='primary-button'>Registrar</button>
        </div>
        <div className='mb-4'>
          ¿Ya tienes cuenta? &nbsp;
          <Link href={`/login`}>Ingresar</Link>
        </div>
      </form>
    </Layout>
  );
};

export default Login;
