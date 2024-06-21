from diagrams import Cluster, Diagram
from diagrams.aws.general import User
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.storage import S3
from diagrams.aws.network import InternetGateway, PublicSubnet, PrivateSubnet, ALB, Endpoint
from diagrams.onprem.network import Internet

with Diagram("", filename="vpc_diagram", outformat="png"):
    user = User("User")
    internet = Internet("Internet")

    with Cluster("AWS"):
        s3 = S3("S3")

        with Cluster("VPC"):
            s3Endpoint = Endpoint("VPC Gateway\nEndpoint")

            ec2InstanceEndpoint = Endpoint("EC2 Instance Connect\nEndpoint")
            igw = InternetGateway("Internet\nGateway")

            with Cluster("Public Subnet"):
                alb = ALB("App Load Balancer")
                publicSubnet = PublicSubnet("Public Subnet")

            with Cluster("Private Subnet"):
                privateSubnet = PrivateSubnet("Private Subnet")

                with Cluster("Target Group"):
                    asg = AutoScaling("Auto Scaling Group")
                    asg - [
                        EC2("EC2 Instance"), EC2("EC2 Instance")]

            asg << alb
            asg >> s3Endpoint >> s3

    asg << ec2InstanceEndpoint << user
    alb << igw << internet
