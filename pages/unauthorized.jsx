import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";

const Unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;

  return (
    <Layout title={"No autorizado"}>
      <h1 className='text-xl'>Acceso Denegado</h1>
      {message && <div className='text-red-500'>{message}</div>}
    </Layout>
  );
};

export default Unauthorized;
