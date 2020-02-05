import { Router } from 'express';

import jwtAuth from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(jwtAuth);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.get('/recipients', RecipientController.index);

export default routes;
