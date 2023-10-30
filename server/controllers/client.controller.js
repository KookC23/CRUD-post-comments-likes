import Client from '../models/client.model';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const client = new Client(req.body);
  try {
    await client.save();
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
    let clients = await Client.find().select('name last_name id_card phone address email created updated ');
    res.json(clients);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const clientById = async (req, res, next, id) => { 
  try {
    let client = await Client.findById({_id: id});
    if(!client) {
      return res.status(400).json({
        error: 'Client not found'
      });
    }
    req.profile = client;
    next();
  } catch (err) { 
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve client"
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
    let client = req.profile;
    client = merge(client, req.body);

    client.updated = Date.now();
    await client.save();
    client.hashed_password = '';
    client.salt = '';
    res.json(client);
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
    let client = req.profile;
    console.log('client to remove', client);
    let deletedClient = await client.deleteOne();
    deletedClient.hashed_password = '';
    deletedClient.salt = '';
    res.json(deletedClient);
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
  clientById,
  update
};
