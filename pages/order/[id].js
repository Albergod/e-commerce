import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

import { getError } from "../data/error";

function reducer(state, action) {
  switch (action.type) {
    case "FECTH_REQUEST": {
      return { ...state, loading: true, error: "" };
    }
    case "FECTH_SUCCESS": {
      return { ...state, loading: false, order: action.payload, error: "" };
    }
    case "FETCH_FAIL": {
      return { ...state, loading: false, error: action.payload };
    }
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };

    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, pagoExitoso: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, pagoExitoso: false, errorPay: "" };
    default:
      state;
      break;
  }
}

function OrderScreen() {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { query } = useRouter();
  const OrderId = query.id;

  const [{ loading, error, order, pagoExitoso, loadingPay }, dispatch] =
    useReducer(reducer, { loading: true, order: {}, error: "" });

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch({ type: "FECTH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${OrderId}`);

        dispatch({ type: "FECTH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: getError(error) });
      }
    };
    if (!order._id || pagoExitoso || (order._id && order._id !== OrderId)) {
      fetch();
      if (pagoExitoso) {
        dispatch({ type: "RESET_PAGO" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [OrderId, order, pagoExitoso, paypalDispatch]);

  const {
    orderItems,
    ShippingAdress,
    PaymentMethod,
    precioArticle,
    taxPrecio,
    precioCompra,
    totalPrecio,
    pago,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [{ amount: { value: totalPrecio } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details
        );

        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Compra pagada exitosamente");
      } catch (error) {
        dispatch({ type: "PAY_FAIL", payload: getError(error) });
        toast.error(getError(error));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <Layout title={`Orden ${OrderId}`}>
      <h1 className='mb-4 text-xl'>`Orden ${OrderId}`</h1>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className='alert_error'>{error}</div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Direccion de compra</h2>
              <div>
                {ShippingAdress.nombreCompleto},{ShippingAdress.direccion},{" "}
                {ShippingAdress.ciudad}, {ShippingAdress.codigoP},{" "}
                {ShippingAdress.pais}
              </div>
              {isDelivered ? (
                <div className='alert_success'>Entregado en {deliveredAt}</div>
              ) : (
                <div className='alert_error'>Error: No entregado.</div>
              )}
            </div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Método de compra</h2>
              <div>{PaymentMethod}</div>
              {pago ? (
                <div className='alert_success'>Pagado en ${paidAt}</div>
              ) : (
                <div className='alert_error'>No pago</div>
              )}
            </div>
            <div className='card overflow-auto p-5'>
              <h2 className='mb-2 text-lg'>Articulos:</h2>

              <table className='min-w-full'>
                <thead className='border-b'>
                  <tr>
                    <th className='px-5 text-left'>Item</th>
                    <th className='px-5 text-right'>Cantidad</th>
                    <th className='px-5 text-right'>Precio</th>
                    <th className='px-5 text-right'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((x) => (
                    <tr key={x._id} className='border-b'>
                      <td>
                        <Link href={`/product/${x.slug}`}>
                          <a className='flex items-center'>
                            <Image
                              src={x.imagen}
                              alt={x.nombre}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {x.nombre}
                          </a>
                        </Link>
                      </td>
                      <td className='p-5 text-right'>{x.cantidad}</td>
                      <td className='p-5 text-right'>{x.precio}</td>
                      <td className='p-5 text-right'>
                        ${x.cantidad * x.precio}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className='card p-5'>
              <h2 className='mb-2 text-lg'>Total:</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Artículos</div>
                    <div>${precioArticle}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>${taxPrecio}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Compra</div>
                    <div>${precioCompra}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total:</div>
                    <div>${totalPrecio}</div>
                  </div>
                </li>
                {!pago && (
                  <li>
                    {isPending ? (
                      <div>Cargando...</div>
                    ) : (
                      <div className='w-full'>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <div>Cargando...</div>}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;

export default OrderScreen;
