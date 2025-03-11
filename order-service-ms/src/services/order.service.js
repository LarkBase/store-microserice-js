const { createNewOrder, findOrder, updateStatus, deleteOrder } = require("../repositories/order.repository");

const createOrder = async (userId, orderData) => {
  if (!orderData.items || orderData.items.length === 0) {
    throw new Error("Order must have at least one item.");
  }

  return createNewOrder(userId, orderData);
};

const findOrderById = async (orderId) => {
  return findOrder(orderId);
};

const changeOrderStatus = async (orderId, status) => {
  const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid order status provided."); // ✅ Now handled BEFORE Prisma call
  }

  return updateStatus(orderId, status);
};

const removeOrder = async (orderId) => {
  return deleteOrder(orderId);
};

module.exports = { createOrder, findOrderById, changeOrderStatus, removeOrder };
