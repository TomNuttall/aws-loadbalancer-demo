from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EC2
from diagrams.aws.network import InternetGateway, PublicSubnet
from diagrams.onprem.network import Internet

with Diagram("", filename="vpc_diagram", outformat="png"):

  internet = Internet("Internet")

  with Cluster("AWS"):    
    with Cluster("VPC"):
      igw = InternetGateway("Internet\nGateway")

      with Cluster("Public Subnet"):
        ec2 = EC2("EC2")
        publicSubnet = PublicSubnet("Public Subnet")        

      ec2 >>  igw
           
  igw >> Edge(label="") << internet