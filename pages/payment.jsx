import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckWizard from "../components/CheckWizard";
import Layout from "../components/Layout";
import { Store } from "./data/contex";
import Cookies from "js-cookie";

export default function PaymentMethod() {
  const router = useRouter();

  const [selectedPaymentMethod, setselectedPaymentMethod] = useState("");
  const { state, dispatch } = useContext(Store);
  const { compra } = state;
  const { ShippingAdress, PaymentMethod } = compra;

  function SubmitHandler(e) {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      toast.error("Por favor elige un método de pago.");
    }

    dispatch({ type: "GUARDAR_PAGO", payload: selectedPaymentMethod });

    Cookies.set(
      "compra",
      JSON.stringify({ ...compra, PaymentMethod: selectedPaymentMethod })
    );

    router.push("/placeOrder");
  }

  useEffect(() => {
    if (!ShippingAdress.direccion) {
      return router.push("/comprando");
    }
    setselectedPaymentMethod(PaymentMethod || "");
  }, [PaymentMethod, ShippingAdress.direccion, router]);

  return (
    <Layout title={"Método de pago"}>
      <CheckWizard activeStep={2} />
      <form className='mx-auto max-w-screen-md' onSubmit={SubmitHandler}>
        <h1 mb-4 text-xl>
          Método de pago
        </h1>
        {["Paypal", "Pago directo", "Contra-reenbolso"].map((x) => (
          <div key={x} className='mb-4'>
            <input
              name='paymentMethod'
              type='radio'
              id={x}
              className='p-2 outline-none focus:ring-0'
              checked={selectedPaymentMethod === x}
              onChange={() => setselectedPaymentMethod(x)}
            />
            <label htmlFor={x} className='p-2'>
              {x}
            </label>
          </div>
        ))}

        <div className='mb-4 flex justify-between'>
          <button
            onClick={() => router.push("/comprando")}
            type='button'
            className='default-button'
          >
            Volver
          </button>
          <button className='primary-button' type='submit'>
            Siguiente
          </button>
        </div>
      </form>
    </Layout>
  );
}

PaymentMethod.auth = true;
