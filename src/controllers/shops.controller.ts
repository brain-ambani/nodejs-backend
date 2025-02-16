import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createShop(req: Request, res: Response): Promise<void> {
  const { name, slug, location, adminId, attendantIds } = req.body;

  try {
    // check for fields validation
    if (!name || !slug || !location || !adminId) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }
    // check if shop already exists by name
    const existingShop = await db.shop.findUnique({
      where: {
        slug,
      },
    });

    if (existingShop) {
      res.status(409).json({
        error: `Shop ${name} already exists`,
      });
      return;
    }

    // create shop
    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantIds,
      },
    });

    res.status(201).json({
      message: "Shop created successfully",
      data: newShop,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getShops(req: Request, res: Response): Promise<void> {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        name: "desc",
      },
    });

    res.status(200).json({
      message: "Shops retrieved successfully",
      data: shops,
      error: null,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getShopAttendants(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id } = req.params;
    const shop = await db.shop.findUnique({
      where: {
        id,
      },
    });

    if (!shop) {
      res.status(404).json({
        message: "Shop not found",
        data: null,
        error: null,
      });
      return;
    }

    // Get users whose ids are in the attendantIds array
    const attendants = await db.user.findMany({
      where: {
        id: {
          in: shop.attendantIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        phone: true,
        email: true,
      },
    });

    res.status(200).json({
      message: "Shop attendants retrieved successfully",
      data: attendants,
      error: null,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}

export async function getShopById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const shop = await db.shop.findUnique({
      where: {
        id,
      },
    });

    if (!shop) {
      res.status(404).json({
        message: "Shop not found",
        data: null,
        error: null,
      });
      return;
    }

    res.status(200).json({
      message: "Shop retrieved successfully",
      data: shop,
      error: null,
    });

    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
}
