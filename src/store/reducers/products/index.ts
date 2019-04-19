/**
 * Types
 */
const FETCH_PRODUCT = "FETCH_PRODUCT";

/**
 *
 * Def
 */
export type ProductsState = Array<{
  name: string;
  price: string;
}>;
import { AnyAction } from "redux";

/**
 * Action
 */
const fetchProduct = (payload: ProductsState) => {
  return {
    type: FETCH_PRODUCT,
    payload
  };
};

/**
 * Reduce
 */
const productsInitState = [
  {
    name: "example-1",
    price: "2000"
  },
  {
    name: "example-2",
    price: "1800"
  }
];
const productsReducer = (state: ProductsState, action: AnyAction) => {
  switch (action.type) {
    case FETCH_PRODUCT: {
      return action.payload;
    }
    default: {
      return productsInitState;
    }
  }
};

export default productsReducer;
