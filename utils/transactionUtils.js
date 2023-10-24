const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  incrementBalance: async (account_id, amount) => {
    try {
      await prisma.bank_accounts.update({
        where: { id: account_id },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
  decrementBalance: async (account_id, amount) => {
    try {
      await prisma.bank_accounts.update({
        where: { id: account_id },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
};
