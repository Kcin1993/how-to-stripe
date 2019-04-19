import React from "react";
import styled from "styled-components";
import { Elements, StripeProvider } from "react-stripe-elements";

import CheckoutForm from "./components/CheckoutForm";

type Props = {};

export default class Home extends React.PureComponent<Props> {
  render() {
    return (
      <HomeWrap>
        <div className="home_inner">
          <StripeProvider apiKey="pk_test_SjRmObEbJQ6dAkDwZs9dZHZq">
            <div className="example">
              <Elements>
                <CheckoutForm />
              </Elements>
            </div>
          </StripeProvider>
        </div>
      </HomeWrap>
    );
  }
}

const HomeWrap = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  .home_inner {
    width: 500px;
    border: 1px solid lightgray;
    padding: 1em;
    border-radius: 3px;
  }
`;
