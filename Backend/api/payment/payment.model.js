const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    payment_refNumber: {
      type: String,
    },
    plan: {
      type: String,
    },
    validity: {
      type: String,
    },
    amount: {
      type: String,
    }
  },
  { timestamps: true }
);

const Payment = mongoose.model("payment", paymentSchema)

module.exports = Payment