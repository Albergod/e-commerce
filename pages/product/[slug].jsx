import { useRouter } from "next/router";
import Link from "next/link";
import React from "react";
import Layout from "../../components/Layout";
import { data } from "../data/data";
import Image from "next/image";
import { useContext } from "react";
import { Store } from "../data/contex";

const ProductScren = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  //=============================amtes de crear contexto
  const { query } = useRouter();
  //slug viene del parámetro de la url
  const { slug } = query;

  //se busca en la lista algun producto que coincida con el slug seleccionado
  const product = data.products.find((x) => x.slug === slug);

  //si no hay producto con slug coincidente, retorna producto no encontrado
  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  const handleSubmit = () => {
    const existArticle = state.compra.articulos.find(
      (x) => x.slug === product.slug
    );
    const cantidad = existArticle ? existArticle.cantidad + 1 : 1;

    if (product.cantidadEnVenta < cantidad) {
      alert("Este prodcuto esta agotado");
      return;
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
