import type { Request, Response } from 'express';
import { MenuItemService } from '../services/menuItemServices';

export class MenuItemController {
  private menuItemService: MenuItemService;

  constructor(
    menuItemService: MenuItemService = new MenuItemService(),
  ) {
    this.menuItemService = menuItemService;
  }

  private handleError(
    res: Response,
    error: unknown,
  ): Response {
    if (
      error instanceof Error &&
      error.message === 'MENU_ITEM_NOT_FOUND'
    ) {
      return res.status(404).json({
        status: 'fail',
        message: 'Data menu tidak ditemukan',
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }

  getMenuItems = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const data =
        await this.menuItemService.getAllMenuItems();

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  getMenuItemById = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      const data =
        await this.menuItemService.getMenuItemById(id);

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  createMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const {
        stallId,
        name,
        price,
        isAvailable,
      } = req.body;

      if (
        stallId === undefined ||
        !name ||
        price === undefined ||
        isAvailable === undefined
      ) {
        return res.status(400).json({
          status: 'fail',
          message:
            'stallId, name, price, dan isAvailable wajib diisi',
        });
      }

      const data =
        await this.menuItemService.createMenuItem({
          stallId: Number(stallId),
          name,
          price: Number(price),
          isAvailable: Boolean(isAvailable),
        });

      return res.status(201).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  updateMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      const data =
        await this.menuItemService.updateMenuItem(
          id,
          req.body,
        );

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  deleteMenuItem = async (
    req: Request,
    res: Response,
  ): Promise<Response> => {
    try {
      const id = Number(req.params.id);

      const data =
        await this.menuItemService.deleteMenuItem(id);

      return res.status(200).json({
        status: 'success',
        data,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}