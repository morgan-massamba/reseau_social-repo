const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const multer = require('../middleware/multer-config');
const upload = multer.single('file');

exports.signup = (req, res) => {
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                password: hash,
                email: req.body.email,
                username: req.body.username,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'utilisateur créé !' })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Utilisateur non trouvé !' });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res
                            .status(401)
                            .json({ message: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_SECRET_TOKEN',
                            { expiresIn: '24h' }
                        ),
                    });
                })
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.getUser = (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => res.status(200).json({ user }))
        .catch((error) => res.status(400).json({ error }));
};

exports.updateUser = (req, res) => {
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
            User.updateOne(
                { _id: req.params.id },
                { userAvatar: req.file.location, _id: req.params.id }
            )
                .then(() =>
                    res
                        .status(200)
                        .json({
                            message: 'les infos de user ont bien été modifié',
                        })
                )
                .catch((error) => res.status(400).json({ error }));
        }
    });
};

exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.status(201).json({ message: 'Utilisateur supprimé !' }))
        .catch((error) => res.status(400).json({ error }));
};
