const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ENV = require("../config/env.config");
const { findUserByEmail, createUser, saveSession, deleteSession } = require("../repositories/auth.repository");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, ENV.JWT_SECRET, { expiresIn: "7d" });
};

const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email already registered.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({ name, email, password: hashedPassword });

  return { id: newUser.id, email: newUser.email, role: newUser.role };
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid email or password.");
  }

  const token = generateToken(user);
  await saveSession({ userId: user.id, token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });

  return { token, user: { id: user.id, email: user.email, role: user.role } };
};

const logoutUser = async (userId) => {
  await deleteSession(userId);
  return { message: "Logged out successfully." };
};

module.exports = { registerUser, loginUser, logoutUser };
