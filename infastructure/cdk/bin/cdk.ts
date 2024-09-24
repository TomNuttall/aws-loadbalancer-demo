#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { VPCStack } from '../lib/vpc'
import { Ec2Stack } from '../lib/ec2'
import { CodeDeployStack } from '../lib/codedeploy'

import 'dotenv/config'

const config = {
  env: {
    account: process.env.AWS_ACCOUNT_NUMBER,
    region: process.env.AWS_ACCOUNT_REGION,
  },
}

const app = new cdk.App()

const vpcStack = new VPCStack(app, 'VPCStack', { env: config.env })
const ec2Stack = new Ec2Stack(app, 'EC2Stack', {
  env: config.env,
  vpc: vpcStack.vpc,
  certificateArn: `arn:aws:acm:${process.env.AWS_ACCOUNT_REGION}:${process.env.AWS_ACCOUNT_NUMBER}:certificate/${process.env.CERTIFICATE_ID}`,
  domain: `${process.env.DOMAIN}`,
})
new CodeDeployStack(app, 'CodeDeployStack', {
  env: config.env,
  repoName: process.env.REPO_NAME || '',
  asg: ec2Stack.asg,
  targetGroup: ec2Stack.targetGroup,
})
