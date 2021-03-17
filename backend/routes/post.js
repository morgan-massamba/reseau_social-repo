const express = require('express');
const router  = express.Router();

const auth = require('../middleware/auth')
const postCtrl = require('../controllers/post')

//POSTS
router.post('/', auth, postCtrl.newPost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, postCtrl.modifyOnePost);
router.delete('/:id', auth, postCtrl.deleteOnePost);

//LIKES
router.post('/:id/like', auth, postCtrl.likeOnePost);

//COMMENTAIRES
router.post('/:id/comment', auth, postCtrl.newComment)
router.delete('/:id/comment/:commentId', auth, postCtrl.deleteComment)

module.exports = router;