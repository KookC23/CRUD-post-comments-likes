import express from 'express';
import billCtrl from '../controllers/bill.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/bills')
  .get(billCtrl.list) 
  .post(billCtrl.create);

router.route('/api/bills/:billId')
  .get(authCtrl.requireSignin, billCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, billCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, billCtrl.remove);

router.param('billId', billCtrl.billById);

export default router;
