const { PrismaClient } = require("@prisma/client"),
  ApiResponse = require("../utils/apiResponseUtils"),
  prisma = new PrismaClient();

module.exports = {
  createAccount: async (req, res) => {
    try {
      let { bank_name, bank_account_number, balance, user_id } = req.body;
      balance = parseInt(balance);
      user_id = parseInt(user_id);
      bank_account_number = parseInt(bank_account_number);

      const existingUser = await prisma.users.findUnique({
        where: { id: user_id },
      });

      if (!existingUser) {
        return res.status(404).json(ApiResponse.error("User Not Found"));
      }

      const account = await prisma.bank_accounts.create({
        data: {
          bank_name: bank_name,
          bank_account_number: bank_account_number,
          balance: balance,
          user: {
            connect: { id: user_id },
          },
        },
      });

      const data = {
        ...account,
        balance: parseInt(account.balance),
        bank_account_number: parseInt(account.bank_account_number),
      };
      return res
        .status(201)
        .json(ApiResponse.success("Create Bank Account Successfully", data));
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
  getAccounts: async (req, res) => {
    try {
      const accounts = await prisma.bank_accounts.findMany({
        include: {
          user: true,
        },
      });

      const data = accounts.map((account) => {
        return {
          bank_account_id: parseInt(account.id),
          bank_name: account.bank_name,
          bank_account_number: parseInt(account.bank_account_number),
          balance: parseInt(account.balance),
          user_id: parseInt(account.user.id),
        };
      });

      return res
        .status(200)
        .json(
          ApiResponse.success("Fethed All Data Bank Account Successfully", data)
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },

  getAccountById: async (req, res) => {
    try {
      const { accountId } = req.params;

      const account = await prisma.bank_accounts.findUnique({
        where: {
          id: parseInt(accountId),
        },
        include: {
          user: true,
          source_transaction: true,
          destination_transaction: true,
        },
      });

      if (!account) {
        return res.status(404).json(ApiResponse.error("Account Not Found"));
      }

      const data = {
        bank_account_id: parseInt(account.id),
        bank_name: account.bank_name,
        bank_account_number: parseInt(account.bank_account_number),
        balance: parseInt(account.balance),
        user_id: parseInt(account.user.id),
      };

      const transactions = await prisma.bank_account_transactions.findMany({
        where: {
          source_account_id: parseInt(account.id),
        },
        take: 5,
        orderBy: {
          id: "desc",
        },
      });

      const historyTransaction = transactions.map((transaction) => {
        return {
          transaction_id: parseInt(transaction.id),
          source_account: parseInt(transaction.source_account_id),
          destination_account: parseInt(transaction.destination_account_id),
          amount: parseInt(transaction.amount),
        };
      });

      const response = {
        ...data,
        latest_transaction: historyTransaction,
      };

      return res
        .status(200)
        .json(
          ApiResponse.success(
            "Fetched Data Bank Account By Id Successfully",
            response
          )
        );
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
};
