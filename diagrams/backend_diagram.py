from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.network import ALB, Route53

with Diagram("", filename="backend_diagram", outformat="png"):
    user = User("User")

    with Cluster("AWS"):
        route_53 = Route53("Route53")
        app_load_balancer = ALB("Application Load Balancer")
        route_53 >> app_load_balancer

        with Cluster("Target Group"):
            app_load_balancer >> Edge(label="") >> AutoScaling(
                "Auto Scaling Group") >> [EC2("Worker 1"), EC2("Worker 2")]

    user >> Edge(label="") >> route_53
