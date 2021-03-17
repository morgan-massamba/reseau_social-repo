//SECURITE
const cors = require('cors');
const helmet = require('helmet');

const bodyParser = require('body-parser');

//IMPORT DES ROUTES
const postRoutes = require('./routes/post')
const userRoutes = require('./routes/user')

//SERVER
const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose
    .connect(
        'mongodb+srv://user45:user45@openclassrooms.djmes.mongodb.net/reseau_social?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json());

app.use(cors());
app.use(helmet());

//SET UP DES ROUTES
app.use('/auth', userRoutes)
app.use('/post', postRoutes)

module.exports = app;
