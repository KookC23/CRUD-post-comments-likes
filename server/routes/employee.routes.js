import express from 'express';
import employeeCtrl from '../controllers/employee.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/employees')
  .get(employeeCtrl.list) 
  .post(employeeCtrl.create);

router.route('/api/employees/:employeeId')
  .get(authCtrl.requireSignin, employeeCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, employeeCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, employeeCtrl.remove);

router.param('employeeId', employeeCtrl.employeeById);

export default router;
