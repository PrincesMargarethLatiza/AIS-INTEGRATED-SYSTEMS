import pool from '../config/db.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const adapterLayerBaseUrl =
  process.env.ADAPTER_LAYER_URL || 'http://localhost:5000/api/auth/register'

export const createUser = async (userProfile, email, password) => {
  if (email === '') {
    throw new Error('Invalid Email')
  }
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format')
  }

  const [user] = await pool.query('SELECT * FROM tbluser WHERE email = ?', [email])

  if (user.length === 1) {
    throw new Error('Account already exist')
  }
  if (password === '') {
    throw new Error('Invalid Password')
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Password is too Weak')
  }

  const salt = bcrypt.genSaltSync(10)
  const newPassword = bcrypt.hashSync(password, salt)

  const response = await fetch(`${adapterLayerBaseUrl}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userProfile)
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Adapter Layer error: ${response.status} - ${errorText}`)
  }

  await response.json()

  const [newUser] = await pool.query(
    'INSERT INTO tbluser (email, password) VALUES(?,?)',
    [email, newPassword]
  )

  return newUser.insertId
}

export const getUser = async id => {
  if (isNaN(parseInt(id))) {
    throw new Error('invalid id')
  }

  const user = await pool.query('SELECT * FROM tbluser WHERE id = ?', [id])
  return user
}

export const login = async (email, password) => {
  if (email === '' || password === '') {
    throw new Error('Email and Password is required')
  }

  const [user] = await pool.query('SELECT * FROM tbluser WHERE email = ?', [email])

  if (user.length === 0) {
    throw new Error(`An account with email: ${email} does not exist`)
  }

  if (!bcrypt.compareSync(password, user[0].password)) {
    throw new Error('Incorrect Password')
  }

  const token = jwt.sign({ id: user[0].id }, process.env.SECRET, {
    expiresIn: '1d'
  })

  return token
}
