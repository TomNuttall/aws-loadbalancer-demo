import express, { Router } from 'express'
import IndexController from '../controllers/index.controller'

const router: Router = express.Router()
const controller = new IndexController()

router.get('/', controller.get.bind(controller))

export default router
