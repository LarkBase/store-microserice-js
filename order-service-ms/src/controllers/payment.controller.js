const { createPayment, findPaymentById , changePaymentStatus} = require("../services/payment.service");

const processPayment = async (req, res) => {
  try {
    const payment = await createPayment(req.body); 
    res.status(201).json({ success: true, payment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getPaymentDetails = async (req, res) => {
  try {
    const payment = await findPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePaymentStatus = async (req, res) => {
    try {
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ success: false, message: "Payment status is required." });
      }
  
      const updatedPayment = await changePaymentStatus(req.params.id, status);
      res.status(200).json({ success: true, payment: updatedPayment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

module.exports = { processPayment, getPaymentDetails, updatePaymentStatus };
