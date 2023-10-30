import express from 'express';
import providerCtrl from '../controllers/provider.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/providers')
  .get(providerCtrl.list) 
  .post(providerCtrl.create);

router.route('/api/providers/:providerId')
  .get(authCtrl.requireSignin, providerCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, providerCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, providerCtrl.remove);

router.param('providerId', providerCtrl.providerById);

export default router;