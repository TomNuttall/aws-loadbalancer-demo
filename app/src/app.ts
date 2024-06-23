import express, { Express } from 'express'
import cors from 'cors'
import path from 'path'
import bodyparser from 'body-parser'
import router from './routes/index.route'

const app: Express = express()

// Config
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())

// Routes
app.use('/', router)

export default app
