import React from "react";
import { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import Layout from "../components/Layout";
import { Store } from "./data/contex";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-toastify";

const CompraScreen = () => {
  const route = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    compra: { articulos },
  } = state;

  const handlerDelete = (item) => {
    dispatch({ type: "ELIMINAR_ARTICULO", payload: item });
  };

  async function handlerUpdateCompra(item, ctd) {
    const cantidad = Number(ctd);

    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.cantidadEnVenta < cantidad) {
      return toast.error("Lo siento, éste producto ya agotó");
    }

    dispatch({ type: "AGREGAR_ARTICULO", payload: { ...item, cantidad } });
  }

  return (
    <Layout title={"compra"}>
      <h1 className='mb-4 text-xl'>Carrito de compras</h1>
      {articulos.length === 0 ? (
        <div>
          No hay compras disponibles.{" "}
          <Link href={"/"}>¿Quieres comprar algo?</Link>
        </div>
      ) : (
        <div className='grid md: grid-cols-4 md: gap-5'>
          <div className='overflow-x-auto md: col-span-3'>
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
                  <tr key={x.slug} className='border-b'>
                    <td>
                      <Link href={"/product/" + x.slug}>
                        <a className='flex items-center'>
                          <Image
                            src={x.imagen}
                            width={50}
                            height={50}
                            alt={x.nombre}
                          ></Image>
                          {x.nombre}
                        </a>
                      </Link>
                    </td>
                    <td className='p-5 text-right'>
                      <select
                        value={x.cantidad}
                        onChange={(e) => handlerUpdateCompra(x, e.target.value)}
                      >
                        {[...Array(x.cantidadEnVenta).keys()].map((vl) => (
                          <option key={vl + 1} value={vl + 1}>
                            {vl + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='p-5 text-right'>${x.precio}</td>
                    <td className='p-5 text-center'>
                      <button onClick={() => handlerDelete(x)}>eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='card p-5'>
            <ul>
              <li>
                <div className='pb-3'>
                  Subtotal ({articulos.reduce((a, c) => a + c.cantidad, 0)}) : $
                  {articulos.reduce((a, c) => a + c.cantidad * c.precio, 0)}
                </div>
              </li>
              <li>
                <button
                  className='primary-button w-full'
                  onClick={() => route.push("login?redirect=/comprando")} //si hay login de user, se enviará a comprando
                >
                  Comprar
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(CompraScreen), { ssr: false });
