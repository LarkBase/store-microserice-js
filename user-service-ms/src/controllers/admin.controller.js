const { getAllUsers, getUserById, createUserByAdmin, updateUserByAdmin, deleteUserByAdmin } = require("../services/admin.service");

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await createUserByAdmin({ name, email, password, role });
    res.status(201).json({ success: true, message: "User created successfully.", user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await updateUserByAdmin(req.params.id, req.body);
    res.status(200).json({ success: true, message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await deleteUserByAdmin(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
