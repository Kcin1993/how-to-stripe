require("dotenv").config();
import * as express from "express";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as Stripe from "stripe";
const stripe = new Stripe(process.env.API_KEY);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "build")));

app.post("/payment/charge", async (req, res) => {
  const { id } = req.body;
  try {
    if (id && process.env.API_KEY) {
      let chargeCreate = await stripe.charges.create({
        amount: 2000,
        currency: "usd",
        description: "Test charge from how-to-stripe",
        source: id
      });
      if (chargeCreate.status)
        res.json({
          success: true,
          msg: "Charge 成功執行"
        });
      else
        res.json({
          success: false,
          msg: chargeCreate.failure_message
        });
    } else {
      throw "API_KEY or id is undefined";
    }
  } catch (err) {
    console.log("[payment/charge error]", err);
    res.json({
      success: false,
      msg: err
    });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

app.listen(process.env.PORT || 9000, () =>
  console.log(`server is running @ ${process.env.PORT || "9000"} `)
);
