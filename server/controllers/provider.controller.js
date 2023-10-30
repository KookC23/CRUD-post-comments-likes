import Provider from '../models/provider.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const provider = new Provider(req.body);
  try {
    await provider.save();
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
    let providers = await Provider.find().select('name last_name id_card phone address email created updated ');
    res.json(providers);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const providerById = async (req, res, next, id) => { 
  try {
    let provider = await Provider.findById({_id: id});
    if(!provider) {
      return res.status(400).json({
        error: 'Provider not found'
      });
    }
    req.profile = provider;
    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve provider"
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
    let provider = req.profile;
    provider = merge(provider, req.body);

    provider.updated = Date.now();
    await provider.save();
    provider.hashed_password = '';
    provider.salt = '';
    res.json(provider);
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
    let provider = req.profile;
    console.log('provider to remove', provider);
    let deletedProvider = await provider.deleteOne();
    deletedProvider.hashed_password = '';
    deletedProvider.salt = '';
    res.json(deletedProvider);
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
  providerById,
  update
};