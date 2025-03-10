const { getUserProfile, updateProfile, deleteProfile } = require("../services/profile.service");

const getProfile = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await updateProfile(req.user.id, { name, email });
    res.status(200).json({ success: true, message: "Profile updated.", user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await deleteProfile(req.user.id);
    res.status(200).json({ success: true, message: "User account deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user account." });
  }
};

module.exports = { getProfile, updateUser, deleteUser };
