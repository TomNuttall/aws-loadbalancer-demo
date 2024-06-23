import express, { Router, Request, Response } from 'express'
import IndexController from '../controllers/index.controller'

const router: Router = express.Router()
const controller = new IndexController()

router.get('/', async (req: Request, res: Response) => {
  const result = await controller.get()
  console.log(result)

  res.render('home', result)
})

export default router
