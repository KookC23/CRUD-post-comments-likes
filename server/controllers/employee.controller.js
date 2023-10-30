import Employee from '../models/employee.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const employee = new Employee(req.body);
  try {
    await employee.save();
    return res.status(200).json({
      message: 'Successfully signed up!'
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const list = async (req, res) => {
  try {
    let employees = await Employee.find().select('name last_name id_card phone address email created updated ');
    res.json(employees);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const employeeById = async (req, res, next, id) => { 
  try {
    let employee = await Employee.findById({_id: id});
    if(!employee) {
      return res.status(400).json({
        error: 'Employee not found'
      });
    }
    req.profile = employee;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve employee"
    });
  }
};

const read = (req, res) => { 
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  req.name = 'ss';
  return res.json(req.profile);
};

const update = async (req, res, next) => {
  try {
    let employee = req.profile;
    employee = merge(employee, req.body);
    employee.updated = Date.now();
    await employee.save();
    employee.hashed_password = '';
    employee.salt = '';
    res.json(employee);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const remove = async (req, res, next) => {
  try {
    console.log('deleted');
    let employee = req.profile;
    console.log('employee to remove', employee);
    let deletedEmployee = await employee.deleteOne();
    deletedEmployee.hashed_password = '';
    deletedEmployee.salt = '';
    res.json(deletedEmployee);
  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

export default {
  create,
  list,
  read,
  remove,
  employeeById,
  update
};
