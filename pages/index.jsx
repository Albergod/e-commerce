import React from "react";
import Cards from "../components/Cards";
import Layout from "../components/Layout";
import { data } from "./data/data";

const App = () => {
  return (
    <div>
      <Layout title={"Home"}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4'>
          {data.products.map((product) => (
            <Cards product={product} key={product.slug} />
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default App;
