import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import jwtAuth from './app/middlewares/auth';
import checkIdRecipient from './app/middlewares/checkIdRecipient';
import authProvider from './app/middlewares/authProvider';

// CONTROLLERS
import UserController from './app/controllers/UserController';
import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import CourierController from './app/controllers/CourierController';
import ProfilePictureController from './app/controllers/ProfilePictureController';

const routes = new Router();
const upload = multer(multerConfig);

// NO AUTHENTICATION REQUIRED ROUTES
routes.post('/users', upload.single('file'), UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/test', UserController.delete);

// AUTHENTICATION REQUIRED ROUTES
routes.use(jwtAuth);

// UPLOAD IMAGE
routes.post(
  '/profile-picture/:profile/:id',
  upload.single('file'),
  ProfilePictureController.store
);

// USERS ROUTES
routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.get('/users/unique', UserController.show);
routes.get('/users/unique/:id', authProvider, UserController.show);

// RECIPIENTS ROUTES
routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.post('/recipients/:id', checkIdRecipient, RecipientController.update);
routes.delete('/recipients/:id', checkIdRecipient, RecipientController.delete);

// COURIERS ROUTES
routes.get('/couriers', authProvider, CourierController.index);
routes.post('/couriers', authProvider, CourierController.store);

export default routes;
