const prisma = require("../config/database.config");

const createNewOrder = async (userId, orderData) => {
  return prisma.order.create({
    data: {
      userId,
      totalAmount: orderData.totalAmount,
      status: "PENDING",
      items: {
        create: orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
      payment: {
        create: {
          method: orderData.paymentMethod,
          status: "PENDING",
        },
      },
      tracking: {
        create: {
          status: "PENDING",
        },
      },
    },
    include: { items: true, payment: true, tracking: true },
  });
};

const findOrder = async (orderId) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, payment: true, tracking: true },
  });
};

const updateStatus = async (orderId, status) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

const deleteOrder = async (orderId) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
};

module.exports = { createNewOrder, findOrder, updateStatus, deleteOrder };
