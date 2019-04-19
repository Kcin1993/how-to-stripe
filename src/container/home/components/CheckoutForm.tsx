import React from "react";
import styled from "styled-components";
import {
  CardElement,
  CardNumberElement,
  injectStripe,
  CardCVCElement,
  CardExpiryElement
} from "react-stripe-elements";
import { Button, Divider, Header, Icon, Grid } from "semantic-ui-react";
import axios from "axios";

type Props = {} & any;
type State = {
  cardElementType: "default" | "customize";
  loading: boolean;
  success: boolean;
};

class CheckoutForm extends React.PureComponent<Props> {
  state: State = {
    cardElementType: "customize",
    loading: false,
    success: false
  };

  handleCardType = async () => {
    this.setState({
      cardElementType:
        this.state.cardElementType === "default" ? "customize" : "default"
    });
  };

  handleSubmit = async () => {
    this.setState({ loading: true });
    try {
      let { token } = await this.props.stripe.createToken();
      await axios
        .post("/payment/charge", {
          id: token.id
        })
        .then(response => {
          const { success, msg } = response.data;
          if (success) {
            alert("交易完成，可以至 stripe 查看交易內容");
          } else {
            alert(`交易錯誤: ${msg}`);
          }
          this.setState({ loading: false });
          window.location.reload();
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      alert(
        "Error when process payment or charge. View browser console or server console"
      );
      console.log("[Error log]", err);
    }
  };

  render() {
    const isDefaultType = this.state.cardElementType === "default";
    return (
      <CheckoutFormWrap>
        <Header as="h1">
          React Stripe Elements Example
          <Header.Subheader>
            <span className="type_change" onClick={() => this.handleCardType()}>
              <Icon name="exchange" />
              切換卡片模式
            </span>
          </Header.Subheader>
        </Header>
        <Divider hidden />
        <p>
          輸入信用卡資訊來完成結帳(
          {isDefaultType
            ? "Stripe 初始的信用卡輸入元件"
            : "自訂所有的信用卡輸入欄位"}
          )
        </p>
        {isDefaultType ? (
          <div className="stripe_default_element">
            {/**
              1. Stripe 原始的信用卡欄位
              2. 可以做一點整體外型的客製
             */}
            <CardElement className="demo_card_element" />
          </div>
        ) : (
          <div className="customize_card_element">
            {/**
              1. 將個別元件拆解出來
              2. 可以做更多的客製化
             */}
            <Grid>
              <Grid.Row columns="1">
                <Grid.Column>
                  <label>16 碼信用卡號</label>
                  <div className="customize_card_element_input">
                    <CardNumberElement />
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="2">
                <Grid.Column>
                  <label>卡片期限</label>
                  <div className="customize_card_element_input">
                    <CardExpiryElement />
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <label>三位數安全碼</label>
                  <div className="customize_card_element_input">
                    <CardCVCElement />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
        <Divider hidden />
        <Button
          onClick={() => this.handleSubmit()}
          color="teal"
          loading={this.state.loading}
          disabled={this.state.loading}
        >
          Confirm to pay
        </Button>
      </CheckoutFormWrap>
    );
  }
}

const CheckoutFormWrap = styled.div`
  .demo_card_element {
    border: 1px solid lightgray;
    border-radius: 3px;
    padding: 0.6em;
  }
  .type_change {
    font-size: 14px;
    vertical-align: middle;
    cursor: pointer;
  }
  .customize_card_element {
    label {
      display: block;
      margin: 0 0 3px 0;
    }
    .customize_card_element_input {
      border: 1px solid lightgray;
      border-radius: 3px;
      padding: 0.6em;
    }
  }
`;

export default injectStripe(CheckoutForm);
