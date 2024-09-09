interface IHomeViewProps {
  title: string
  message: string
}

class IndexController {
  constructor(private serverId: string) {}

  async get(): Promise<IHomeViewProps> {
    return {
      title: 'Express App',
      message: `Served by ${this.serverId}`,
    }
  }
}

export default IndexController
