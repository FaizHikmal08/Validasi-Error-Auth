import { Router } from 'express';
import { MenuItemController } from '../controllers/menuItemControllers.ts';

const menuItemRouter = Router();

const menuItemController = new MenuItemController();

menuItemRouter.get('/', (req, res) => {
  return menuItemController.getMenuItems(req, res);
});

menuItemRouter.get('/:id', (req, res) => {
  return menuItemController.getMenuItemById(req, res);
});

menuItemRouter.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }

  // #swagger.responses[201] = { description: 'Menu berhasil dibuat' }

  return menuItemController.createMenuItem(req, res);
});
menuItemRouter.put('/:id', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', required: true, schema: { $ref: '#/definitions/MenuItemInput' } }

  // #swagger.responses[200] = { description: 'Menu berhasil diperbarui' }

  return menuItemController.updateMenuItem(req, res);
});

menuItemRouter.delete('/:id', (req, res) => {
  // #swagger.responses[200] = { description: 'Menu berhasil dihapus' }

  return menuItemController.deleteMenuItem(req, res);
});

export { menuItemRouter };