const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(cors({
  origin: "*"
}));

app.use(express.json());

connectDB();
app.use("/api", require("./router/adminAuthRoute"));
app.use("/api", require("./router/authRoute"));
app.use("/api", require("./router/adminChargeRoute"));
app.use("/api", require("./router/userApplyRoute"));
app.use("/api",require("./router/userChargeRoute"));
app.use("/api",require("./router/adminProfileRoute"))

app.listen(process.env.PORT, () =>
  console.log("🚀 Server running")
);
