import React, { useContext } from "react";

import Head from "next/head";
import Link from "next/link";
import { Store } from "../pages/data/contex";

const Layout = ({ title, children }) => {
  const { state } = useContext(Store);
  // del estado de extrae la propiedad de compras
  const { compra } = state;

  return (
    <div>
      <Head>
        <title>{title ? title + "-storebouble" : "StoreBouble | App"}</title>
      </Head>
      <div className='flex min-h-screen flex-col justify-between'>
        <header>
          <nav className='flex h-12 items-center px-4 justify-between shadow-md'>
            <Link href={"/"}>
              <a className='text-lg font-bold'>StoreBouble</a>
            </Link>
            <div>
              <Link href={"/compra"}>
                <a className='p-2'>
                  Compras
                  {compra.articulos.length > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {compra.articulos.reduce((a, c) => a + c.cantidad, 0)}
                    </span>
                  )}
                </a>
              </Link>
              <Link href={"/login"}>
                <a className='p-2'>Ingresar</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          copyright©2022 Storebouble
        </footer>
      </div>
    </div>
  );
};

export default Layout;
