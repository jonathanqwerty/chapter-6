const { PrismaClient } = require("@prisma/client"),
  HashData = require("../utils/hashDataUtils"),
  jwtToken = require("../utils/tokenUtils"),
  prisma = new PrismaClient();

const ApiResponse = require("../utils/apiResponseUtils");

module.exports = {
  register: async (req, res) => {
    try {
      let { name, email, password, identity_number, identity_type, address } =
        req.body;

      const existingEmail = await prisma.users.findFirst({
        where: {
          email: email,
        },
      });

      if (existingEmail) {
        return res
          .status(409)
          .json(ApiResponse.error("Email Already Register"));
      }

      const hashedPassword = await HashData.create(password);
      const user = await prisma.users.create({
        data: {
          name: name,
          email: email,
          password: hashedPassword,
          profile: {
            create: {
              identity_number: identity_number,
              identity_type: identity_type,
              address: address,
            },
          },
        },
      });

      const response = {
        name,
        email,
        identity_number,
        identity_type,
        address,
      };
      return res
        .status(201)
        .json(ApiResponse.success("Register User Successfully", response));
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
  login: async (req, res) => {
    try {
      const user = await prisma.users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!user) {
        return res.status(404).json(ApiResponse.error("User Not Found"));
      }

      const hashedPassword = user.password;
      const verifyPassword = await HashData.verify(
        req.body.password,
        hashedPassword
      );

      if (!verifyPassword) {
        return res.status(400).json(ApiResponse.error("Wrong Password"));
      }

      const tokenData = user.id;
      const token = await jwtToken.create(tokenData);

      return res
        .status(200)
        .json(ApiResponse.success("Login Successfully", { token: token }));
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
  profile: async (req, res) => {
    try {
      const user = await prisma.users.findFirst({
        where: {
          id: req.id,
        },
        include: {
          profile: true,
          bank_accounts: true,
        },
      });
      user.password = undefined;

      return res
        .status(200)
        .json(ApiResponse.success("Fetch Data Profile Successfully", user));
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
  changePassword: async (req, res) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id: req.id,
        },
      });

      const verifyPassword = await HashData.verify(
        req.body.old_password,
        user.password
      );

      const hashPassword = await HashData.create(req.body.new_password);

      if (verifyPassword) {
        await prisma.users.update({
          where: {
            id: req.id,
          },
          data: {
            password: hashPassword,
          },
        });

        return res
          .status(201)
          .json(ApiResponse.success("Change Password Successfully"));
      } else {
        return res
          .status(403)
          .json(ApiResponse.error("Your old password is invalid"));
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json(ApiResponse.error("Internal Server Error"));
    }
  },
};
