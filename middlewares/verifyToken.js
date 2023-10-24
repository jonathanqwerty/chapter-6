const { PrismaClient } = require("@prisma/client"),
  prisma = new PrismaClient(),
  jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"],
    token = authHeader && authHeader.split()[1];

  if (!token) {
    return res.status(403).json(ApiResponse.error("please provide a token"));
  }
  try {
    const jwtPayload = jwt.verify(token, process.env.TOKEN_KEY);
    if (!jwtPayload) {
      return res.status(403).json(ApiResponse.error("unauntheticated"));
    }

    const user = await prisma.users.findFirst({
      where: {
        id: jwtPayload.id,
      },
    });
    req.id = user.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json(ApiResponse.error("Internal Server Error"));
  }
};

module.exports = verifyToken;
