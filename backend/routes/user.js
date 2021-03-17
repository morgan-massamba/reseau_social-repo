const express = require('express');
const router = express.Router()

const auth = require('../middleware/auth')
const userCtrl = require('../controllers/user')

//AUTHENTIFICATION
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

//USER INFOS
router.get('/profile/:id', auth, userCtrl.getUser)
router.put('/profile/:id', auth, userCtrl.updateUser)
router.delete('/delete-user/:id', auth, userCtrl.deleteUser)

module.exports = router;