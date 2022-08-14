import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckWizard from "../components/CheckWizard";
import Layout from "../components/Layout";
import { Store } from "./data/contex";
import { getError } from "./data/error";
import axios from "axios";
import Cookies from "js-cookie";

const Placeorder = () => {
  const router = useRouter();
  const {
    state: { compra },
    dispatch,
  } = useContext(Store);

  const { articulos, ShippingAdress, PaymentMethod } = compra;

  const round2 = (num) => Math.round((num * 100 + Number.EPSILON) / 100);
  const precioArticle = round2(
    articulos.reduce((a, c) => a + c.cantidad * c.precio, 0)
  );
  const precioCompra = precioArticle > 200 ? 0 : 15;
  const taxPrecio = round2(precioArticle * 0.15);
  const totalPrecio = round2(precioArticle + taxPrecio + precioArticle);

  useEffect(() => {
    if (!PaymentMethod) {
      router.push("/payment");
    }
  }, [PaymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: articulos,
        ShippingAdress,
        PaymentMethod,
        precioArticle,
        taxPrecio,
        precioCompra,
        totalPrecio,
      });
      setLoading(false);
      dispatch({ type: "LIMPIAR" });
      Cookies.set("compra", JSON.stringify({ ...compra, articulos: [] }));
      router.push(`/order/${data._id}`);
    } catch (error) {
      setLoading(false);
      toast.error(getError(error));
    }
  };

  return (
    <Layout title={"Realizar pedido"}>
      <CheckWizard activeStep={3} />
      <h1 className='mb-4 text-xl'>Realizar pedido.</h1>

      {articulos.length === 0 ? (
        <div>
          No hay compra disponible.
          <Link href={"/"}>¿Quieres ir a comprar?</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            {/*  */}
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Direccion de compra</h2>
              <div>
                {ShippingAdress.nombreCompleto},{ShippingAdress.direccion},{" "}
                {ShippingAdress.ciudad}, {ShippingAdress.codigoP},{" "}
                {ShippingAdress.pais}
              </div>
              <div>
                <Link href={"/comprando"}>Editar</Link>
              </div>
            </div>
            {/*  */}
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Método de pago</h2>
              <div>{PaymentMethod}</div>
              <div>
                <Link href={"/payment"}>Editar</Link>
              </div>
            </div>
            {/*  */}
            <div className='card overflow-x-auto p-5'>
              <h2 className='mb-2 text-lg'>Artículos:</h2>
              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='p-5 text-right'>Cantidad</th>
                    <th className='p-5 text-right'>Precio</th>
                    <th className='px-5'>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {articulos.map((x) => (
                    <tr key={x._id} className='border-b'>
                      <td>
                        <Link href={`/product/${x.slug}`}>
                          <a className='flex items-center'>
                            <Image
                              src={x.imagen}
                              alt={x.nombre}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {x.nombre}
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{x.cantidad}</td>
                      <td className='p-5 text-right'>{x.precio}</td>
                      <td className='p-5 text-right'>
                        ${x.cantidad * x.precio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <Link href={"/compra"}>Editar compra</Link>
              </div>
            </div>
          </div>
          {/*  */}
          {/*  */}
          <div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Total orden:</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Articulos</div>
                    <div>${precioArticle}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>${taxPrecio}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Compra</div>
                    <div>${precioCompra}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>${totalPrecio}</div>
                  </div>
                </li>
                <li>
                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className='primary-button w-full'
                  >
                    {loading ? "Realizando..." : "Realizar pedido"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

Placeorder.auth = true;
export default dynamic(() => Promise.resolve(Placeorder), { ssr: false });
