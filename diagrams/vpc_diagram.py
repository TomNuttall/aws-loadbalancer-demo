from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.storage import S3
from diagrams.aws.network import InternetGateway, NATGateway, PublicSubnet, PrivateSubnet, ALB, Endpoint
from diagrams.onprem.network import Internet

with Diagram("", filename="vpc_diagram", outformat="png", direction="TB"):
    user = User("WhiteList IP")
    internet = Internet("Internet")

    with Cluster("AWS"):
        s3 = S3("S3")

        s3Endpoint = Endpoint("VPC Gateway\nEndpoint")
        ec2InstanceEndpoint = Endpoint("EC2 Instance Connect\nEndpoint")

        with Cluster("VPC"):
            igw = InternetGateway("Internet\nGateway")

            with Cluster("Public Subnet"):
                alb = ALB("App Load Balancer")
                natgw = NATGateway("NAT\nGateway")

                publicSubnet = PublicSubnet("Public Subnet")

            with Cluster("Private Subnet"):
                privateSubnet = PrivateSubnet("Private Subnet")

                asg = AutoScaling("Auto Scaling Group")
                with Cluster("Target Group"):
                    targetGroup = EC2("EC2 Instance")
                    asg - targetGroup

        asg << alb
        targetGroup >> s3Endpoint >> s3
        targetGroup << ec2InstanceEndpoint

        targetGroup >> natgw >> igw

        alb << igw

    ec2InstanceEndpoint << user
    igw << Edge(label="") >> internet
