import Invoice_detail from '../models/invoice_detail.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const invoice_detail = new Invoice_detail(req.body);
  try {
    await invoice_detail.save();
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
    let invoice_details = await Invoice_detail.find().select('amount updated created');
    res.json(invoice_details);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const invoice_detailById = async (req, res, next, id) => { 
  try {
    let invoice_detail = await Invoice_detail.findById({_id: id});
    if(!invoice_detail) {
      return res.status(400).json({
        error: 'Invoice_detail not found'
      });
    }
    req.profile = invoice_detail;
    next();
  } catch (err) { 
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve invoice_detail"
    });
  }
};

const read = (req, res) => { 
  req.name = 'ss';
  return res.json(req.profile);
};

const update = async (req, res, next) => {
  try {
    let invoice_detail = req.profile;
    invoice_detail = merge(invoice_detail, req.body);
    invoice_detail.updated = Date.now();
    await invoice_detail.save();
    res.json(invoice_detail);
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
    let invoice_detail = req.profile;
    console.log('invoice_detail to remove', invoice_detail);
    let deletedInvoice_detail = await invoice_detail.deleteOne();
    res.json(deletedInvoice_detail);
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
  invoice_detailById,
  update
};
