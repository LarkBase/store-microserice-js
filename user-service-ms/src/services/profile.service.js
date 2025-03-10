const { findUserById, updateUser, deleteUser } = require("../repositories/user.repository");

const getUserProfile = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};

const updateProfile = async (userId, updateData) => {
  return updateUser(userId, updateData);
};

const deleteProfile = async (userId) => {
  await deleteUser(userId);
  return { message: "User account deleted successfully." };
};

module.exports = { getUserProfile, updateProfile, deleteProfile };
