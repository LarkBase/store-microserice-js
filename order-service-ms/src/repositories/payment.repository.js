const prisma = require("../config/database.config");

const initiatePayment = async (paymentData) => {
  // ✅ Check if payment already exists for the given orderId
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId: paymentData.orderId },
  });

  if (existingPayment) {
    throw new Error("Payment for this order already exists.");
  }

  return prisma.payment.create({
    data: {
      orderId: paymentData.orderId,
      method: paymentData.method, // ✅ Uses ENUM
      status: "PENDING",
      amount: paymentData.amount,
      paidAt: null,
    },
  });
};

const getPayment = async (paymentId) => {
  return prisma.payment.findUnique({
    where: { id: paymentId },
  });
};

const updatePayment = async (paymentId, status) => {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status, paidAt: status === "COMPLETED" ? new Date() : null }, // ✅ Set paidAt only if completed
    });
  };

module.exports = { initiatePayment, getPayment, updatePayment};
