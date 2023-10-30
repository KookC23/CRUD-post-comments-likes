import Bill from '../models/bill.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const bill = new Bill(req.body);
  try {
    await bill.save();
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
    let bills = await Bill.find().select('total subtotal updated created');
    res.json(bills);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const billById = async (req, res, next, id) => { 
  try {
    let bill = await Bill.findById({_id: id});
    if(!bill) {
      return res.status(400).json({
        error: 'Bill not found'
      });
    }
    req.profile = bill;
    next();
  } catch (err) { 
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve bill"
    });
  }
};

const read = (req, res) => { 
  req.name = 'ss';
  return res.json(req.profile);
};

const update = async (req, res, next) => {
  try {
    let bill = req.profile;
    bill = merge(bill, req.body);
    bill.updated = Date.now();
    await bill.save();
    res.json(bill);
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
    let bill = req.profile;
    console.log('bill to remove', bill);
    let deletedBill = await bill.deleteOne();
    res.json(deletedBill);
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
  billById,
  update
};
