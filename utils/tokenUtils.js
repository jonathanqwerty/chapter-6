const jwt = require("jsonwebtoken"),
  dotenv = require("dotenv");

dotenv.config();

const TOKEN_KEY = process.env.TOKEN_KEY;

module.exports = {
  create: async (tokenData, tokenKey = TOKEN_KEY) => {
    try {
      const token = jwt.sign({ tokenData }, tokenKey, {
        expiresIn: "2h",
      });
      return token;
    } catch (error) {
      throw error;
    }
  },
};
