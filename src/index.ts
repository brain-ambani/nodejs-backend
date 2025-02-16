import express from "express";
import userRouter from "./routes/users.route";
import shopRouter from "./routes/shops.route";

require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

app.use("/api/v1", userRouter);
app.use("/api/v1", shopRouter);
