from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import EC2
from diagrams.aws.network import ELB, Route53
from diagrams.aws.management import Cloudwatch
from diagrams.onprem.ci import GithubActions
from diagrams.onprem.container import Docker

with Diagram("", filename="backend_diagram", outformat="png"):
  user = User("User")
  #github_action_ecr = GithubActions("Github Action")
  #docker_image = Docker("Docker App")
    
  with Cluster("AWS"):
    route_53 = Route53("Route53")

    with Cluster(""):
      route_53 >> ELB("Load Balancer") >> [EC2("Worker 1"), EC2("Worker 2")]

  user >> Edge(label="/GET") >> route_53
  #github_action_ecr >> Edge(label="Build + push image")  >> docker_image >> ecr
