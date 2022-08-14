import React, { useContext } from "react";
import Cards from "../components/Cards";
import Layout from "../components/Layout";
import Products from "../models/Products";
import { Store } from "./data/contex";
import axios from "axios";

import db from "./data/db";
import { toast } from "react-toastify";

const App = ({ products }) => {
  const {
    state: { compra },
    dispatch,
  } = useContext(Store);

  const handleSubmit = async (products) => {
    const existArticle = compra.articulos.find((x) => x.slug === products.slug);
    const cantidad = existArticle ? existArticle.cantidad + 1 : 1;
    const { data } = await axios.get(`/api/products/${products._id}`);
    console.log(data);

    if (data.cantidadEnVenta < cantidad) {
      return toast.error("Lo siento, éste producto ya agotó");
    }

    //en el boton agregar lo que se agrega es el dispatch por que es la funcion que dispara el switch
    //la cantidad significa los pedidos de ese producto
    dispatch({
      type: "AGREGAR_ARTICULO",
      payload: { ...products, cantidad },
    });

    toast.success("Producto añadido.");
  };

  return (
    <div>
      <Layout title={"Home"}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {products.map((product) => (
            <Cards
              product={product}
              key={product.slug}
              handleSubmit={handleSubmit}
            />
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default App;

export const getServerSideProps = async () => {
  await db.connect();
  const products = await Products.find().lean(); //buscar todos loa productos en la base de datos

  return {
    props: {
      products: products.map(db.convertDocToObject),
    },
  };
};
