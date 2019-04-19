import { createStore, applyMiddleware, Reducer, Middleware } from "redux";

const storeConfiguration = (reducers: Reducer, middlewares: any) => {
  const useMiddleware = middlewares ? applyMiddleware(middlewares) : undefined;
  return createStore(reducers, useMiddleware);
};

export default storeConfiguration;
