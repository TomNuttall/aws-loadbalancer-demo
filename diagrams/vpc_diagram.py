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

            with Cluster("Avalability Zone A"):
                with Cluster("Public Subnet"):
                    natgwa = NATGateway("NAT\nGateway")
                    publicSubneta = PublicSubnet("Public Subnet")

                with Cluster("Private Subnet"):
                    privateSubneta = PrivateSubnet("Private Subnet")
                    targetGroupa = EC2("EC2 Instance")
                    asg - targetGroupa

            with Cluster("Avalability Zone B"):
                with Cluster("Public Subnet"):
                    natgwb = NATGateway("NAT\nGateway")
                    publicSubnetb = PublicSubnet("Public Subnet")

                with Cluster("Private Subnet"):
                    privateSubnetb = PrivateSubnet("Private Subnet")
                    targetGroupb = EC2("EC2 Instance")
                    asg - targetGroupb

        asg << alb
        targetGroupa >> s3Endpoint >> s3
        targetGroupb >> s3Endpoint >> s3

        targetGroupa >> natgwa >> igw
        targetGroupb >> natgwb >> igw

        alb << igw

    igw << Edge(label="") >> internet
