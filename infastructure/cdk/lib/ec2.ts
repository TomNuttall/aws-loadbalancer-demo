import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'

interface Ec2StackProps extends cdk.StackProps {
  vpc: ec2.IVpc
  certificateArn: string
  domain: string
}

export class Ec2Stack extends cdk.Stack {
  readonly asg: autoscaling.AutoScalingGroup
  readonly targetGroup: elbv2.ApplicationTargetGroup

  constructor(scope: Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props)

    // Create a security group for EC2 instances
    const appSecurityGroup = new ec2.SecurityGroup(this, 'App SecurityGroup', {
      vpc: props.vpc,
      description: 'Allow access to EC2 instances',
      allowAllOutbound: true,
    })

    appSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3000),
      'Allow HTTP Access',
    )

    appSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'Allow SSH Access',
    )

    const instanceConnectEndpoints = props.vpc.privateSubnets.map(
      ({ subnetId }, idx) => {
        return new ec2.CfnInstanceConnectEndpoint(
          this,
          `InstanceConnectEndpoint_${idx}`,
          {
            subnetId: subnetId, // Use private subnets
            securityGroupIds: [appSecurityGroup.securityGroupId],
          },
        )
      },
    )

    const userData = ec2.UserData.forLinux()
    userData.addCommands(
      'dnf update -y',
      'curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -',
      'dnf install -y nodejs',
      'npm install -g pm2',
      'dnf install -y ruby wget',
    )

    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess'),
        // iam.ManagedPolicy.fromAwsManagedPolicyName(
        //   'AmazonEC2RoleforAWSCodeDeploy',
        // ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'CloudWatchAgentServerPolicy',
        ),
      ],
    })

    const instanceProfile = new iam.CfnInstanceProfile(
      this,
      'InstanceProfile',
      {
        roles: [ec2Role.roleName],
      },
    )

    const launchTemplate = new ec2.LaunchTemplate(this, 'EC2_ASG_Template', {
      securityGroup: appSecurityGroup,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      userData,
      role: ec2Role,
    })

    // Auto Scaling Group
    this.asg = new autoscaling.AutoScalingGroup(this, 'AutoScalingGroup', {
      vpc: props.vpc,
      launchTemplate,
      minCapacity: 1,
      maxCapacity: 2,
    })
    this.asg.scaleOnCpuUtilization('KeepCpuBelow50', {
      targetUtilizationPercent: 50, // Auto scale when CPU is more than 50%
    })

    // Create an Application Load Balancer (ALB)
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
      vpc: props.vpc,
      internetFacing: true,
    })

    // Allow incoming traffic from the ALB to instances
    this.asg.connections.allowFrom(
      alb,
      ec2.Port.tcp(3000),
      'Allow ALB to connect to ASG on port 3000',
    )

    // Add a listener to the load balancer
    const listener = alb.addListener('HttpListener', {
      port: 80, // Listen on HTTP port 80
      open: true,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: 'HTTPS',
        port: '443',
        permanent: true,
      }),
    })
    // Certificate
    const certificateArn = props.certificateArn
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'ALB Certificate',
      certificateArn,
    )

    // Add a listener for HTTPS
    const httpsListener = alb.addListener('HttpsListener', {
      port: 443,
      certificates: [certificate],
      open: true,
    })

    // Attach the Auto Scaling Group to the Load Balancer
    this.targetGroup = httpsListener.addTargets('TargetGroup', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      targets: [this.asg],
      healthCheck: {
        path: '/', // Health check path, adjust as needed
        interval: cdk.Duration.seconds(30), // Health check interval
      },
    })

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domain,
    })

    // Add an alias record for the ALB in Route 53
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(alb),
      ),
      recordName: 'test',
    })
  }
}
