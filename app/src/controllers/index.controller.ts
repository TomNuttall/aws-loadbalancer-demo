class IndexController {
  async get() {
    return {
      title: 'Express App',
      message: 'Running on 127.0.0.1',
      link: 'https://github.com/TomNuttall/aws-loadbalancer-demo',
      img_name: 'hero-bkgd.jpg',
    }
  }
}

export default IndexController
