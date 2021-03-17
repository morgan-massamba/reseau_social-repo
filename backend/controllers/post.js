const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const multer = require('../middleware/multer-config');
const upload = multer.single('file');

exports.newPost = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({
                success: false,
                errors: {
                    title: 'Image Upload Error',
                    detail: err.message,
                    error: err,
                },
            });
        } else {
            User.findOne({ _id: req.body.userId })
                .then((user) => {
                    if (user) {
                        const post = new Post({
                            userId: user._id,
                            username: user.username,
                            userAvatar: user.userAvatar,
                            content: req.body.content,
                            imageUrl: req.file.location,
                        });
                        post.save()
                            .then(() =>
                                res
                                    .status(201)
                                    .json({ message: 'votre post a été créé' })
                            )
                            .catch((error) => res.status(400).json({ error }));
                    }
                })
                .catch((error) => res.status(500).json({ error }));
        }
    });
};

exports.getAllPosts = (req, res) => {
    Post.find()
        .sort({ _id: 'desc' })
        .then((posts) => res.status(200).json(posts))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOnePost = (req, res) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => res.status(200).json(post))
        .catch((error) => res.status(404).json({ error }));
};

exports.modifyOnePost = (req, res) => {
    Post.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() =>
            res.status(200).json({ message: 'votre post a bien été modifié' })
        )
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteOnePost = (req, res) => {
    Post.deleteOne({ _id: req.params.id })
        .then(() =>
            res.status(200).json({ message: 'votre post a été supprimé' })
        )
        .catch((error) => res.status(400).json({ error }));
};

exports.likeOnePost = (req, res) => {
    const userID = req.body.userId;

    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (post.likers.includes(userID)) {
                Post.updateOne(
                    { _id: req.params.id },
                    { $pull: { likers: userID } }
                )
                    .then(() => res.status(200).json({ message: 'unlike' }))
                    .catch((error) => res.status(400).json({ error }));
            } else {
                Post.updateOne(
                    { _id: req.params.id },
                    { $push: { likers: userID } }
                )
                    .then(() => res.status(200).json({ message: 'post liké' }))
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.newComment = (req, res) => {
    User.findOne({ _id: req.body.userId })
        .then((user) => {
            if (!user) {
                res.status(404).json({ message: 'utilisateur non trouvé' });
            } else {
                Post.updateOne(
                    {
                        _id: req.params.id,
                    },
                    {
                        $push: {
                            comments: {
                                _id: new mongoose.Types.ObjectId(),
                                content: req.body.content,
                                userId: user._id,
                                createdAt: Date(),
                                userAvatar: user.userAvatar,
                                username: user.username,
                            },
                        },
                    }
                )
                    .then(() =>
                        res.status(201).json({ message: 'Commentaire ajouté!' })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.deleteComment = (req, res) => {
    Post.updateOne(
        {
            _id: req.params.id,
        },
        {
            $pull: {
                comments: {
                    _id: mongoose.Types.ObjectId(req.params.commentId),
                },
            },
        }
    )
        .then(() => res.status(200).json({ message: 'commentaire supprimé !' }))
        .catch((error) => res.status(400).json({ error }));
};
