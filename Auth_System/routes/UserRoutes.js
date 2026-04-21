import * as UserController from '../controllers/UserController.js'
import express from 'express'

const userRoutes = express.Router()

userRoutes.post('/login', UserController.login)
userRoutes.post('/register', UserController.register)
userRoutes.post('/new', UserController.register)

export default userRoutes
