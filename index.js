const express = require("express"),
  app = express(),
  cors = require("cors"),
  router = require("./routes/index"),
  swaggerUi = require("swagger-ui-express"),
  swaggerJson = require("./openapi.json");
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.use(express.json({ strict: false }));
app.use(cors);
app.use("/api/v1", router);
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerJson));

app.get("*", (req, res) => {
  return res.status(404).json({
    error: "End point is not registered",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
