import express from 'express';
import invoice_detailCtrl from '../controllers/invoice_detail.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/invoice_details')
  .get(invoice_detailCtrl.list) 
  .post(invoice_detailCtrl.create);

router.route('/api/invoice_details/:invoice_detailId')
  .get(authCtrl.requireSignin, invoice_detailCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, invoice_detailCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, invoice_detailCtrl.remove);

router.param('invoice_detailId', invoice_detailCtrl.invoice_detailById);

export default router;
