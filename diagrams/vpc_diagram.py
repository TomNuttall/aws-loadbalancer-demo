from diagrams import Cluster, Diagram, Edge
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.storage import S3
from diagrams.aws.network import InternetGateway, NATGateway, PublicSubnet, PrivateSubnet, ALB, Endpoint
from diagrams.onprem.network import Internet

with Diagram("", filename="vpc_diagram", outformat="png", direction="TB"):
    internet = Internet("Internet")

    with Cluster("AWS"):
        s3 = S3("S3")
        s3Endpoint = Endpoint("VPC Gateway\nEndpoint")

        with Cluster("VPC"):
            igw = InternetGateway("Internet\nGateway")
            alb = ALB("App Load Balancer")
            asg = AutoScaling("Auto Scaling Group")

            with Cluster("Avalability Zone"):
                with Cluster("Public Subnet"):
                    natgw = NATGateway("NAT\nGateway")
                    publicSubnet = PublicSubnet("Public Subnet")

                with Cluster("Private Subnet"):
                    privateSubnet = PrivateSubnet("Private Subnet")
                    targetGroup = EC2("EC2 Instance")
                    asg - targetGroup

        asg << alb
        targetGroup >> s3Endpoint >> s3

        targetGroup >> natgw >> igw

        alb << igw

    igw << Edge(label="") >> internet
