import React from "react";

const CheckWizard = ({ activeStep = 0 }) => {
  return (
    <div className='mb-5 flex flex-wrap'>
      {[
        "Usuario",
        "Direccion de compra",
        "Método de pago",
        "Realizar pedido",
      ].map((x, i) => (
        <div
          key={i}
          className={`flex-1 border-b-2 text-center ${
            i <= activeStep
              ? "border-indigo-500 text-indigo-500"
              : "border-gray-400 tex-gray-400"
          }`}
        >
          {x}
        </div>
      ))}
    </div>
  );
};

export default CheckWizard;
