interface IHomeViewProps {
  title: string
  message: string
  img: {
    name: string
    alt: string
  }
}

class IndexController {
  constructor(private serverId: string) {}

  async get(): Promise<IHomeViewProps> {
    return {
      title: 'Express App v9',
      message: `Served by ${this.serverId}`,
      img: {
        name: 'hero-bkgd.jpg',
        alt: 'Balancing Stones',
      },
    }
  }
}

export default IndexController
