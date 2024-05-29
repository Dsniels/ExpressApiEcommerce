const controller = require('./user.controller')
const express = require('express')
const auth = require('../Auth/auth.service')
const passport = require('passport')
const router = express.Router()

router.get('/:id', auth.hasRole('user'), controller.show)

router.get('/all', auth.hasRole('manager'), controller.showUsers)

router.post('/registrarse', controller.registerUser)

router.post('/login', controller.loginUser)

router.get('/login/failed', controller.loginFailed)

router.put('/actualizar:id', auth.hasRole('user'), controller.updateUser)

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000/api/productos',
    failureRedirect: '/login'
  }),
  controller.AuthGoogle
)

router.get('/google', passport.authenticate('google', ['profile', 'email']))

module.exports = router
