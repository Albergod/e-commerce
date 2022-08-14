import React, { useContext, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Store } from "../pages/data/contex";
import { Menu } from "@headlessui/react";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DropDownLink from "./DropDownLink";
import Cookies from "js-cookie";

const Layout = ({ title, children }) => {
  const { status, data: session } = useSession();

  const { state, dispatch } = useContext(Store);
  // del estado de extrae la propiedad de compras
  const { compra } = state;

  const [articuloDecompra, setarticuloDecompra] = useState(0);
  useEffect(() => {
    setarticuloDecompra(compra.articulos.reduce((a, c) => a + c.cantidad, 0));
  }, [compra.articulos]);

  const handleLogout = () => {
    Cookies.remove("compra");
    dispatch({ type: "RESET_COMPRA" });
    signOut({ callbackUrl: "/login" });
  };
  return (
    <>
      <Head>
        <title>{title ? title + "-storebouble" : "StoreBouble | App"}</title>
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

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
                  {articuloDecompra > 0 && (
                    <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                      {articuloDecompra}
                    </span>
                  )}
                </a>
              </Link>

              {status === "loading" ? (
                "loading"
              ) : session?.user ? (
                <Menu as={"div"} className='realtive inline-block'>
                  <Menu.Button className='text-blue-600'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white shadow-lg'>
                    <Menu.Item>
                      <DropDownLink className='dropdown-link' href={"/profile"}>
                        Perfil
                      </DropDownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropDownLink className='dropdown-link' href={"/profile"}>
                        Historial de compra
                      </DropDownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href='#'
                        className='dropdown-link'
                        onClick={handleLogout}
                      >
                        Salir
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href={"/login"}>
                  <a className='p-2'>Ingresar</a>
                </Link>
              )}
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          copyright©2022 Storebouble
        </footer>
      </div>
    </>
  );
};

export default Layout;
