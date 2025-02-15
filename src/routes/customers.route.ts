import express from "express";
import {
  createCustomer,
  getCustomer,
  getCustomers,
} from "@/controllers/customers.controller";

const customerRouter = express.Router();

customerRouter.post("/customers", createCustomer);
customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomer);

export default customerRouter;
