from diagrams import Cluster, Diagram, Edge
from diagrams.aws.general import User
from diagrams.aws.compute import EC2, AutoScaling
from diagrams.aws.network import ALB, Route53
from diagrams.aws.security import ACM
from diagrams.aws.storage import S3
from diagrams.aws.devtools import Codedeploy
from diagrams.onprem.ci import GithubActions

with Diagram("", filename="backend_diagram", outformat="png"):
    user = User("User")
    github_action = GithubActions("Github Action")

    with Cluster("AWS"):
        route_53 = Route53("Route53")

        s3_bucket = S3("S3")
        code_deploy_group = Codedeploy("Code Deploy")

        with Cluster(""):
            app_load_balancer = ALB("App Load Balancer")
            app_load_balancer - ACM("ACM")

            with Cluster("Target Group"):
                auto_scaling_group = AutoScaling("Auto Scaling Group")
                app_load_balancer >> auto_scaling_group
                auto_scaling_group - [
                    EC2("EC2 Instance"), EC2("EC2 Instance")]

        route_53 >> Edge(label="HTTPS") >> app_load_balancer

    user >> Edge(label="") >> route_53
    github_action >> Edge(label="Deploys backend app to S3") >> s3_bucket >> Edge(
        label="Deploys to target group") >> code_deploy_group >> auto_scaling_group
