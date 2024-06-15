from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.network import InternetGateway, PublicSubnet, ALB
from diagrams.onprem.network import Internet

with Diagram("", filename="vpc_diagram", outformat="png"):

    internet = Internet("Internet")

    with Cluster("AWS"):
        with Cluster("VPC"):
            igw = InternetGateway("Internet\nGateway")
            alb = InternetGateway("App Load Balancer")

            with Cluster("Target Group A"):
                asg = AutoScaling("Auto Scaling Group")
                publicSubnet = PublicSubnet("Public Subnet")

            asg >> igw
            asg << alb

    igw >> Edge(label="") << internet
    alb >> Edge(label="") << internet
