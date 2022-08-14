import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import Layout from "../../components/Layout";
import axios from "axios";

import Image from "next/image";
import { useContext } from "react";
import { Store } from "../data/contex";
import db from "../data/db";
import Products from "../../models/Products";
import { toast } from "react-toastify";

const ProductScren = (props) => {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  //=============================amtes de crear contexto
  //const { query } = useRouter();
  //slug viene del parámetro de la url
  //const { slug } = query;

  //se busca en la lista algun producto que coincida con el slug seleccionado
  //const product = data.products.find((x) => x.slug === slug);

  //si no hay producto con slug coincidente, retorna producto no encontrado
  if (!product) {
    return (
      <Layout title={"Error"}>
        <h1 className='p-2 text-xl'>Producto no encontrado</h1>

        <Link href={"/"}>Regresar al inicio</Link>
      </Layout>
    );
  }

  const handleSubmit = async () => {
    const existArticle = state.compra.articulos.find(
      (x) => x.slug === product.slug
    );
    const cantidad = existArticle ? existArticle.cantidad + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    console.log(data);

    if (data.cantidadEnVenta < cantidad) {
      return toast.error("Lo siento, éste producto ya agotó");
    }

    //en el boton agregar lo que se agrega es el dispatch por que es la funcion que dispara el switch
    //la cantidad significa los pedidos de ese producto
    dispatch({
      type: "AGREGAR_ARTICULO",
      payload: { ...product, cantidad },
    });

    router.push("/compra");
  };

  return (
    <Layout title={product.nombre}>
      <Link href={"/"}>
        <a className='pb-4'> Volver a productos</a>
      </Link>
      <div className='py-2'>
        {/* crear grid para dividir las partes de la pantalla */}
        <div className='grid md: grid-cols-4 md:gap-3'>
          {/* espacio de imagen */}
          <div className='md: col-span-2'>
            <Image
              src={product.imagen}
              width={640}
              height={640}
              alt={product.categoria}
              layout='responsive'
            />
          </div>

          {/* espacio de informacion */}
          <div>
            <ul>
              <li>
                <h1 className='text-lg'>{product.nombre}</h1>
              </li>
              <li>
                <strong>Categoría</strong>: {product.categoria}
              </li>
              <li>
                <strong>Marca</strong>: {product.marca}
              </li>
              <li>
                <strong>{product.rating}</strong> de
                <strong> {product.numVistas}</strong> Valoraciones
              </li>
              <li>
                <strong>Descripcion</strong>: {product.descripcion}
              </li>
            </ul>
          </div>

          {/* precio */}
          <div>
            <div className='card p-5'>
              {/* separacion de divs */}
              <div className='mb-2 flex justify-between'>
                <div>Precio</div>
                <div> ${product.precio}</div>
              </div>
              <div className='mb-2 flex justify-between'>
                <div>Estado</div>
                <div>
                  {product.cantidadEnVenta > 0 ? "En venta" : "Agotado"}
                </div>
              </div>
              <button className='primary-button w-full' onClick={handleSubmit}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScren;

export const getServerSideProps = async (context) => {
  const {
    params: { slug },
  } = context;

  await db.connect();
  const product = await Products.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObject(product) : null,
    },
  };
};
