import express from 'express';
import clientCtrl from '../controllers/client.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/clients')
  .get(clientCtrl.list) 
  .post(clientCtrl.create);

router.route('/api/clients/:cityId')
  .get(authCtrl.requireSignin, clientCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, clientCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, clientCtrl.remove);

router.param('clientId', clientCtrl.clientById);
export default router;