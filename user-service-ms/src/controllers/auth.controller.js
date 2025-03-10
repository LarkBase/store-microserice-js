const { registerUser, loginUser, logoutUser } = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ success: true, message: "User registered successfully.", user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ success: true, message: "Login successful.", token, user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await logoutUser(userId);
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed." });
  }
};

module.exports = { register, login, logout };
