import express from 'express'
import 'dotenv/config.js'
import userRoutes from './routes/UserRoutes.js'
import cors from 'cors'

const app = express()
const PORT = Number(process.env.PORT) || 3000

let corsOptions = {
  origin: process.env.ORIGIN
}

app.use(express.json())
app.use(cors(corsOptions))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/user', userRoutes)
app.use('/api/auth', userRoutes)
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is running',
    port: PORT
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'No such endpoint exists'
  })
})

try {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`)
  })
} catch (error) {
  console.log(error)
}
