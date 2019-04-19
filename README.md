# Brief

本 Repo 紀錄如何透過 node 與 react 實踐整合 stripe 的支付行為？

在 stripe 中需要先建立 payment 後才能 charge ，兩者合併後才能順利的把消費者的錢放到口袋。用到的基礎建設有：

1. Stripe.js + Element
2. Charge Api

第一點是用於在網頁前端搜集消費者的信用卡敏感資料，並產生對應的 token
第二點是用於應用程式後端，目的為向特定消費者請款，這部分會用到到第一點所產生的機密資料

- 註.1 Payment 可以透過 Stripe 所提供的支付頁面也就是 checkout 的服務。在此我們選擇用 stripe.js & Element 來完成自訂程度較高的支付頁面。
- 註.2 Repo 用 CRA typescript
- 註.3 tsconfig.json 新增 `"lib": ["dom", "esnext"],`

# Get Start

## 步驟一: 在網站介面完成 payment

Stripe.js & Element 有 React 的 package ，我們將採用 `react-stripe-elements` 這個套件協助我們在消費者的網頁介面中完成信用卡敏感資料的採集，同時將 Token 保存在我們的應用程式中的資料庫。安裝與設定套件的流程可參考[於此](https://stripe.com/docs/recipes/elements-react)。

- 註.1 在 html 中引入的 stripe.js 檔案需要透過 https 才能順利讀取。開發時可以用 ngrok 來暫時取得 https
- 註.2 若有 SSR 請參考此[說明](https://github.com/stripe/react-stripe-elements#server-side-rendering-ssr)
- 註.3 `<CardElement />` 是一個集大成的元件，內部自動包含 16 碼、日期、安全碼、郵遞區號... etc 的元件。[元件細節](https://github.com/stripe/react-stripe-elements#element-components)、查看[實際代碼]()
- 註.4 Stripe 本身提供的元件就會自我檢查資料格式是否正確 e.g 信用卡卡號格式非法、日期填寫過去的日期... etc
- 註.5 有卡號、安全碼、信用卡有效期就能送出 Request 取得 Token。取得 Token 的速度非常快，快到不需要 UI loading
- 註.6 送出 request 時會呼叫 stripe 自帶的函式 `this.props.stripe.createToken({ name: "Name" });` 其中 name 為非必填。詳細參數請[參考](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/a38adb3e274730015fa41250e2fb7783560791a0/types/stripe-v3/index.d.ts#L37)
- 註.7 `let { token } = await this.props.stripe.createToken();` 回應內容附錄

## 步驟二: 在 server 端完成 charge

實作上前端在取得 Token 後，應該將此 Token 與該顧客的相關資料(e.g 交易金額、訂單內容、商品內容、顧客資料)，一起紀錄在 DB 中。本段直接將 token 送至 server 端，並模擬特定金額的付款。

- 註.1 後端 Charge 時會需要金額的參數。可以非即時 charge？以及動態的計算 charge 的金額？
- 註.2 後端 Stripe API 所需的金鑰可以從 `.env` 檔案中更換自己的金鑰
- 註.3 後端執行 `stripe.charges.create()` 後的回應請參考附錄

# Run this Repo

若要實際執行此 App ，依序：

1. 安裝套件 `yarn`
2. 於根目錄中建立 `.env` 檔案，並更新 `API_KEY=YOUR_STRIPE_API_KEY`
3. 依序執行 `yarn build` --> `yarn start`
4. 執行 `ngrok http 9000` 取得 https 的環境



# 回應範例

### Payment 回應範例

```
{
  "id": "tok_1EQtgqBpNqaK2OSKW7QQr4pC",
  "object": "token",
  "card": {
    "id": "card_1EQtgqBpNqaK2OSKsORhpzar",
    "object": "card",
    "address_city": null,
    "address_country": null,
    "address_line1": null,
    "address_line1_check": null,
    "address_line2": null,
    "address_state": null,
    "address_zip": null,
    "address_zip_check": null,
    "brand": "Visa",
    "country": "TW",
    "cvc_check": "unchecked",
    "dynamic_last4": null,
    "exp_month": 2,
    "exp_year": 2045,
    "funding": "debit",
    "last4": "2733",
    "metadata": {
    },
    "name": "Name",
    "tokenization_method": null
  },
  "client_ip": "118.160.89.233",
  "created": 1555668688,
  "livemode": false,
  "type": "card",
  "used": false
}

```

### Charge 回應範例

```
{
  id: "ch_1EQuJDBpNqaK2OSKITOVSHgX",
  object: "charge",
  amount: 2000,
  amount_refunded: 0,
  application: null,
  application_fee: null,
  application_fee_amount: null,
  balance_transaction: "txn_1EQuJDBpNqaK2OSK9qsWznF5",
  billing_details: {
    address: {
      city: null,
      country: null,
      line1: null,
      line2: null,
      postal_code: null,
      state: null
    },
    email: null,
    name: null,
    phone: null
  },
  captured: true,
  created: 1555671067,
  currency: "usd",
  customer: null,
  description: "Test charge from how-to-stripe",
  destination: null,
  dispute: null,
  failure_code: null,
  failure_message: null,
  fraud_details: {},
  invoice: null,
  livemode: false,
  metadata: {},
  on_behalf_of: null,
  order: null,
  outcome: {
    network_status: "approved_by_network",
    reason: null,
    risk_level: "normal",
    risk_score: 10,
    seller_message: "Payment complete.",
    type: "authorized"
  },
  paid: true,
  payment_intent: null,
  payment_method: "card_1EQuJBBpNqaK2OSKjgjb28Vz",
  payment_method_details: {
    card: {
      brand: "visa",
      checks: [Object],
      country: "US",
      description: "Visa Classic",
      exp_month: 12,
      exp_year: 2024,
      fingerprint: "Uh4w4KsaEqcV3RfY",
      funding: "credit",
      last4: "4242",
      three_d_secure: null,
      wallet: null
    },
    type: "card"
  },
  receipt_email: null,
  receipt_number: null,
  receipt_url:
    "https://pay.stripe.com/receipts/acct_1AQCOnBpNqaK2OSK/ch_1EQuJDBpNqaK2OSKITOVSHgX/rcpt_EujmUWuxSdyoT1jVJxDEgX7yFlmN6mW",
  refunded: false,
  refunds: {
    object: "list",
    data: [],
    has_more: false,
    total_count: 0,
    url: "/v1/charges/ch_1EQuJDBpNqaK2OSKITOVSHgX/refunds"
  },
  review: null,
  shipping: null,
  source: {
    id: "card_1EQuJBBpNqaK2OSKjgjb28Vz",
    object: "card",
    address_city: null,
    address_country: null,
    address_line1: null,
    address_line1_check: null,
    address_line2: null,
    address_state: null,
    address_zip: null,
    address_zip_check: null,
    brand: "Visa",
    country: "US",
    customer: null,
    cvc_check: "pass",
    dynamic_last4: null,
    exp_month: 12,
    exp_year: 2024,
    fingerprint: "Uh4w4KsaEqcV3RfY",
    funding: "credit",
    last4: "4242",
    metadata: {},
    name: null,
    tokenization_method: null
  },
  source_transfer: null,
  statement_descriptor: null,
  status: "succeeded",
  transfer_data: null,
  transfer_group: null
};

```
