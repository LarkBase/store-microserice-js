const prisma = require("../config/database.config");

const findUserByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

const createUser = async (userData) => {
  return prisma.user.create({ data: userData });
};

const saveSession = async (sessionData) => {
  return prisma.session.create({ data: sessionData });
};

const deleteSession = async (userId) => {
  return prisma.session.deleteMany({ where: { userId } });
};

module.exports = { findUserByEmail, createUser, saveSession, deleteSession };
