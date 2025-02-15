import { Request, Response, NextFunction } from "express";

export async function getCustomers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const customers = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
      },
      {
        id: 2,
        name: "Joel Smith",
        email: "joel.smith@example.com",
        phone: "+0987654321",
      },
      {
        id: 3,
        name: "Mike Bunny",
        email: "mike@example.com",
        phone: "+0987654321",
      },
    ];

    return res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    console.log(id);
    const customers = [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
      },
      {
        id: 2,
        name: "Joel Smith",
        email: "joel.smith@example.com",
        phone: "+0987654321",
      },
      {
        id: 3,
        name: "Mike Bunny",
        email: "mike@example.com",
        phone: "+0987654321",
      },
    ];

    const customer = customers.find((customer) => customer.id === parseInt(id));

    return res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
}
