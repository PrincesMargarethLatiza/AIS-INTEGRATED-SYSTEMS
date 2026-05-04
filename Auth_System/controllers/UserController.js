import * as UserModel from '../models/UserModel.js'

export const register = async (req, res) => {
  const {
    email,
    password,
    name,
    firstName,
    lastName,
    birthdate,
    dob,
    program,
    course,
    major,
    userStatus,
    status,
    address
  } = req.body

  try {
    const userProfile = {
      name: name || [firstName, lastName].filter(Boolean).join(' '),
      birthdate: birthdate || dob,
      address,
      program: program || [course, major].filter(Boolean).join(' - '),
      userStatus: userStatus || status
    }

    const user = await UserModel.createUser(userProfile, email, password)

    res.status(200).json({
      success: true,
      message: [{ result: 'registration successful' }],
      userId: user
    })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      success: false,
      message: e.message || 'Registration failed'
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const token = await UserModel.login(email, password)
    res
      .status(200)
      .json({ success: true, message: [{ result: 'login succesful' }, token] })
  } catch (e) {
    console.log(e)
    res.status(400).json({
      success: false,
      message: e.message || 'Login failed'
    })
  }
}
