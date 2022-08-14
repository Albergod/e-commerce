import { createContext, useReducer } from "react";
import Cookies from "js-cookie";
export const Store = createContext();

//inicialmente no habran articulos en las compras
const initialState = {
  compra: Cookies.get("compra")
    ? JSON.parse(Cookies.get("compra"))
    : { articulos: [], ShippingAdress: {} },
};

function reducer(state, action) {
  //usar switch para cada situacion de action
  switch (action.type) {
    case "AGREGAR_ARTICULO": {
      //nuevo articulo
      const articulo = action.payload;

      //verificar si existe un articulo
      const exitArticle = state.compra.articulos.find(
        (x) => x.slug === articulo.slug
      );

      //agregarcion
      const articulos = exitArticle
        ? state.compra.articulos.map((x) =>
            x.nombre === exitArticle.nombre ? articulo : x
          )
        : [...state.compra.articulos, articulo];
      Cookies.set("compra", JSON.stringify({ ...state.compra, articulos }));
      return {
        ...state,
        compra: { ...state.compra, articulos },
      };
    }

    case "ELIMINAR_ARTICULO": {
      const articulos = state.compra.articulos.filter(
        (x) => x.slug !== action.payload.slug
      );
      Cookies.set("compra", JSON.stringify({ ...state.compra, articulos }));
      return { ...state, compra: { ...state.compra, articulos } };
    }

    case "RESET_COMPRA": {
      return {
        ...state,
        compra: {
          articulos: [],
          ShippingAdress: { location: {} },
          PaymentMethod: "",
        },
      };
    }

    // case "LIMPIAR": {
    //   return { ...state, compra: { ...state.compra, articulos: [ ] } };
    // }

    case "GUARDAR_DATOS": {
      return {
        ...state,
        compra: {
          ...state.compra,
          ShippingAdress: { ...state.compra.ShippingAdress, ...action.payload },
        },
      };
    }
    case "GUARDAR_PAGO": {
      return {
        ...state,
        compra: {
          ...state.compra,
          PaymentMethod: action.payload,
        },
      };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{children}</Store.Provider>;
}
