import { combineReducers } from "redux";
import productsReducer, { ProductsState } from "./products";

export type StoreState = {
  products: ProductsState;
};

const reducers = combineReducers({
  products: productsReducer
});

export default reducers;
