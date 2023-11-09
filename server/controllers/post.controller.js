import Post from '../models/post.models';
import merge from 'lodash/merge';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => { 
  const post = new Post(req.body);
  try {
    await post.save();
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
    let posts = await Post.find().select('name description comment like create updated created');
    res.json(posts);
  } catch (err) {
    return res.status('400').json({
      error: errorHandler.getErrorMessage(err)
    })
  }
};

const postById = async (req, res, next, id) => { 
  try {
    let post = await Post.findById({_id: id})
    .populate('like', '_id name')
    .populate('comment', '_id name')
    .exec();

    if(!post) {
      return res.status(400).json({
        error: 'Post not found'
      });
    }
    req.profile = post;
    next();
  } catch (err) { 
    console.log(err);
    return res.status(400).json({
      error: "Could not retrieve post"
    });
  }
};

const read = (req, res) => { 
  req.name = 'ss';
  return res.json(req.profile);
};

const update = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtension = true;
  form.parse(req, async (err, fields, files) => {
  try {
    if (err) {
      return res.status(400).json({
        error: 'Photo could not be uploaded'
      });
    }

    let post = req.profile;
    post = extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data =fs.readFileSync(files.photo.filepath);
      post.photo.contentType = files.photo.type;
      }
    await post.save();


    res.json({ post });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage('error', err)
     });

    }
  });
};

const remove = async (req, res, next) => {
  try {
    console.log('deleted');
    let post = req.profile;
    console.log('post to remove', post);
    let deletedPost = await post.deleteOne();
    res.json(deletedPost);
  } catch(err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};


const addCommentToPost = async (req, res) => {
  try {
    const { postId, commentId } = req.body; // Se espera que la solicitud incluya postId y commentId en el cuerpo

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ 
        error: 'Post not found' 
      });
    }
    post.comments.push(commentId);// Agrega el commentId al post
    await post.save();// Guarda el post actualizado en la base de datos
    return res.status(200).json({
      message: 'Comment successfully added!'
    });
  } catch (err) { // si la operación falla ejecuta estos procedimientos
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};


const addlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const updatedComment = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } }, 
      { new: true }
    );
    res.json(updatedComment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};


const defaultPhoto = (req, res) => {
  return res.sendFile(`${process.cwd()}${defaultImage}`);
};


const addunlikePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    const updatedComment = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    res.json(updatedComment);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    });
  }
};

const editPost = async (req, res) => {
  try {
    // Obtén el ID del post a editar desde los parámetros de la URL
    const postId = req.params.postId;

    // Busca el post en la base de datos
    const post = await Post.findById(postId);

    // Verifica si el post existe
    if (!post) {
      return res.status(404).json({ error: 'El post no se encuentra.' });
    }

    // Verifica si el usuario autenticado es el autor del post
    if (post.author !== req.user._id) {
      return res.status(403).json({ error: 'No tienes permiso para editar este post.' });
    }

    // Actualiza el contenido del post con los datos enviados en el cuerpo de la solicitud
    post.content = req.body.content;

    // Guarda los cambios en la base de datos
    await post.save();

    return res.status(200).json({ message: 'El post ha sido editado exitosamente.' });
  } catch (error) {
    return res.status(500).json({ error: 'Se produjo un error al editar el post.' });
  }
};

export default {
  create,
  list,
  read,
  postById,
  remove,
  update,
  addCommentToPost,
  defaultPhoto,
  addlikePost,
  addunlikePost,
  editPost
};