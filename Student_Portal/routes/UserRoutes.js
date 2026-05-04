import express from 'express'
import { createUser, login as loginUser } from '../models/UserModel.js'

const userRoutes = express.Router()

userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const token = await loginUser(email, password)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

userRoutes.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body
    const userId = await createUser(req.body, email, password)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

userRoutes.post('/new', async (req, res) => {
  try {
    const { email, password } = req.body
    const userId = await createUser(req.body, email, password)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      userId
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
})

export default userRoutes
