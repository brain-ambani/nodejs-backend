import { getCustomer, getCustomers } from "@/controllers/customers.controller";
import express, { Router } from "express";

const customerRouter = Router();

customerRouter.get("/customers", getCustomers);
customerRouter.get("/customers/:id", getCustomer);

export default customerRouter;
