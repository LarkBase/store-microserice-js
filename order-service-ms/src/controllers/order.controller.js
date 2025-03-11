const { createOrder, findOrderById, changeOrderStatus, removeOrder } = require("../services/order.service");

const placeOrder = async (req, res) => {
  try {
    const order = await createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required." });
      }
  
      const updatedOrder = await changeOrderStatus(req.params.id, status);
      res.status(200).json({ success: true, order: updatedOrder });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

const cancelOrder = async (req, res) => {
  try {
    await removeOrder(req.params.id);
    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { placeOrder, getOrderDetails, updateOrderStatus, cancelOrder };
