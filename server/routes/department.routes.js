import express from 'express';
import departmentCtrl from '../controllers/department.controller';
import authCtrl from '../controllers/auth.controller';

const router = express.Router();

router.route('/api/departments')
  .get(departmentCtrl.list) 
  .post(departmentCtrl.create);

router.route('/api/departments/: departmentId')
  .get(authCtrl.requireSignin, departmentCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, departmentCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, departmentCtrl.remove);

  router.param('departmentId', departmentCtrl.DepartmentById);

export default router;
