const { initiatePayment, getPayment , updatePayment} = require("../repositories/payment.repository");

const createPayment = async (paymentData) => {
  if (!paymentData.orderId || !paymentData.method || !paymentData.amount) {
    throw new Error("Order ID, Payment Method, and Amount are required.");
  }

  const validMethods = ["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "UPI", "NET_BANKING"];
  if (!validMethods.includes(paymentData.method)) {
    throw new Error("Invalid payment method.");
  }

  try {
    return await initiatePayment(paymentData);
  } catch (error) {
    if (error.message.includes("Payment for this order already exists.")) {
      throw new Error("Payment already exists for this order.");
    }
    throw error;
  }
};

const findPaymentById = async (paymentId) => {
  return getPayment(paymentId);
};

const changePaymentStatus = async (paymentId, status) => {
    const validStatuses = ["PENDING", "COMPLETED", "FAILED"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid payment status provided.");
    }
  
    return updatePayment(paymentId, status);
  };

module.exports = { createPayment, findPaymentById, changePaymentStatus };
