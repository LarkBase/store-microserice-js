const bcrypt = require("bcryptjs");
const { findAllUsers, findUserById, createUser, updateUser, deleteUser } = require("../repositories/user.repository");

const getAllUsers = async () => {
  return findAllUsers();
};

const getUserById = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

const createUserByAdmin = async (userData) => {
  userData.password = await bcrypt.hash(userData.password, 10); // Hash password before saving
  return createUser(userData);
};

const updateUserByAdmin = async (id, updateData) => {
  return updateUser(id, updateData);
};

const deleteUserByAdmin = async (id) => {
  await deleteUser(id);
  return { message: "User deleted successfully." };
};

module.exports = { getAllUsers, getUserById, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin };
