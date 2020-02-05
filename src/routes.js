import { Router } from 'express';

import jwtAuth from './app/middlewares/auth';

// CONTROLLERS
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

// NO AUTHENTICATION REQUIRED ROUTES
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(jwtAuth);

// USERS ROUTES
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);

// RECIPIENTS ROUTES
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.post('/recipients/:id', RecipientController.update);

export default routes;
