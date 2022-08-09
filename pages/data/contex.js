import { createContext, useReducer } from "react";

export const Store = createContext();

//inicialmente no habran articulos en las compras
const initialState = {
  compra: {
    articulos: [],
  },
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
      return {
        ...state,
        compra: { ...state.compra, articulos },
      };
    }

    case "ELIMINAR_ARTICULO": {
      const articulos = state.compra.articulos.filter(
        (x) => x.slug !== action.payload.slug
      );
      return { ...state, compra: { ...state.compra, articulos } };
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
