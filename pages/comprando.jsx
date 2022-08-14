import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import CheckWizard from "../components/CheckWizard";
import Layout from "../components/Layout";
import { Store } from "./data/contex";

export default function Shipping() {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const { compra } = state;
  const { ShippingAdress } = compra;

  useEffect(() => {
    setValue("nombreCompleto", ShippingAdress.nombreCompleto);
    setValue("direccion", ShippingAdress.direccion);
    setValue("ciudad", ShippingAdress.ciudad);
    setValue("codigoP", ShippingAdress.codigoP);
    setValue("pais", ShippingAdress.pais);
  }, [setValue, ShippingAdress]);

  const submitHandler = ({
    nombreCompleto,
    direccion,
    ciudad,
    pais,
    codigoP,
  }) => {
    dispatch({
      type: "GUARDAR_DATOS",
      payload: { nombreCompleto, direccion, ciudad, pais, codigoP, location },
    });
    Cookies.set(
      "compra",
      JSON.stringify({
        ...compra,
        ShippingAdress: {
          nombreCompleto,
          direccion,
          ciudad,
          pais,
          codigoP,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title={"Estas comprando..."}>
      <CheckWizard activeStep={1} />
      <form
        className='mx-auto max-w-screen-md'
        onClick={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Direccion de compra</h1>
        <div className='mb-4'>
          <label htmlFor='nombreCompleto'>Nombre completo</label>
          <input
            type='text'
            className='w-full p-3 bg-slate-100'
            id='nombreCompleto'
            autoFocus
            {...register("nombreCompleto", {
              required: "Por Favor ingrese su nombre",
              minLength: {
                value: 15,
                message: "Por favor ingrese su nombre completo",
              },
            })}
          />
          {errors.nombreCompleto && (
            <div className='text-red-500'>{errors.nombreCompleto.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='direccion'>Direccion</label>
          <input
            type='text'
            className='w-full p-3 bg-slate-100'
            id='direccion'
            {...register("direccion", {
              required: "Por Favor ingrese una direccion",
              minLength: {
                value: 4,
                message: "La direccion debe tener por lo menos 4 caractéres",
              },
            })}
          />
          {errors.direccion && (
            <div className='text-red-500'>{errors.direccion.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='ciudad'>Ciudad</label>
          <input
            type='text'
            className='w-full p-3 bg-slate-100'
            id='ciudad'
            {...register("ciudad", {
              required: "Por Favor ingrese una ciudad de destino",
            })}
          />
          {errors.ciudad && (
            <div className='text-red-500'>{errors.ciudad.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='codigoP'>Codigo Postal</label>
          <input
            type='text'
            className='w-full p-3 bg-slate-100'
            id='codigoP'
            {...register("codigoP", {
              required: "Por Favor ingrese un Código postal",
            })}
          />
          {errors.codigoP && (
            <div className='text-red-500'>{errors.codigoP.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='pais'>Pais</label>
          <input
            type='text'
            className='w-full p-3 bg-slate-100'
            id='pais'
            {...register("pais", {
              required: "Por Favor ingrese un País de destino",
            })}
          />
          {errors.pais && (
            <div className='text-red-500'>{errors.pais.message}</div>
          )}
        </div>
        <div className='mb-4 flex justify-between'>
          <button className='primary-button'>Seguir</button>
        </div>
      </form>
    </Layout>
  );
}
Shipping.auth = true;
