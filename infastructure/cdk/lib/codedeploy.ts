import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy'
import * as iam from 'aws-cdk-lib/aws-iam'

import 'dotenv/config'

interface CodeDeployStackProps extends cdk.StackProps {
  repoName: string
  asg: autoscaling.IAutoScalingGroup
  targetGroup: elbv2.IApplicationTargetGroup
}

export class CodeDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CodeDeployStackProps) {
    super(scope, id, props)

    const codedeployApp = new codedeploy.ServerApplication(
      this,
      'CodeDeployApp',
      {
        applicationName: 'MyCodeDeployApp',
      },
    )

    // Create a CodeDeploy deployment group
    const deploymentGroup = new codedeploy.ServerDeploymentGroup(
      this,
      'CodeDeployDeploymentGroup',
      {
        application: codedeployApp,
        autoScalingGroups: [props.asg],
        //loadBalancer: codedeploy.LoadBalancer.application(props.targetGroup),
        deploymentConfig: codedeploy.ServerDeploymentConfig.ONE_AT_A_TIME,
        installAgent: true,
      },
    )

    const githubRole = new iam.Role(this, 'GitHubOidcRole', {
      assumedBy: new iam.FederatedPrincipal(
        `arn:aws:iam::${props.env?.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
            'token.actions.githubusercontent.com:sub': `repo:${props.repoName}`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description: 'Role assumed by GitHub Actions to interact with CodeDeploy',
    })

    // Add CodeDeploy permissions to the GitHub role
    githubRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'codedeploy:CreateDeployment',
          'codedeploy:GetDeployment',
          'codedeploy:ListApplications',
          'codedeploy:ListDeploymentGroups',
          'codedeploy:BatchGetApplications',
          'codedeploy:GetDeploymentConfig',
          'codedeploy:ListDeploymentConfigs',
        ],
        resources: ['*'], // You can restrict this to specific resources as needed
      }),
    )

    // // Add S3 and other permissions if needed for deployments
    // githubRole.addToPolicy(
    //   new iam.PolicyStatement({
    //     effect: iam.Effect.ALLOW,
    //     actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
    //     resources: ['arn:aws:s3:::YOUR_BUCKET_NAME/*'], // Replace with your S3 bucket
    //   }),
    // )
  }
}
