import { Request, Response } from 'express'

class IndexController {
  async get(req: Request, res: Response, next: any) {
    try {
      res.render('home', { title: 'Test App', message: 'Welcome!' })
    } catch (err) {
      // console.error(`Error`, err.message)
      next(err)
    }
  }
}

export default IndexController
