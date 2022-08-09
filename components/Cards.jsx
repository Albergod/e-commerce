import React from "react";
import Link from "next/link";

const Cards = ({ product }) => {
  return (
    <div className='card'>
      <Link href={`/product/${product.slug}`}>
        <a>
          <img src={product.imagen} alt='camiseta' className='rounded shadow' />
        </a>
      </Link>

      <div className='flex flex-col items-center justify-center p-5'>
        <Link href={`/products/${product.slug}`}>
          <h1 className='text-lg'>{product.nombre}</h1>
        </Link>
        <p className='mb-2'>{product.marca}</p>
        <p className='mb-2'>${product.precio}</p>

        <button className='primary-button' type='button'>
          Agregar
        </button>
      </div>
    </div>
  );
};
export default Cards;
