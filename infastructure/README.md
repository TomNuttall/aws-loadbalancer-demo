# Infastructure

## Overview

- ALB
- ASG -> EC2 launch template

- CloudFormation: Used to deploy infastructure on AWS.
- Code Deploy used to deploy app code

Note: t4g.small is free until dec 31 2024.
https://repost.aws/articles/ARdZ3_Qv8TQdyWhmy4npRMRQ/announcing-amazon-ec2-t4g-free-trial-extension

## Architecture Diagram

<img
  src='../diagrams/backend_diagram.png'
  raw=true
  alt='AWS Backend Architecture Diagram'
  width="100%"
  height="auto"
/>

<img
  src='../diagrams/vpc_diagram.png'
  raw=true
  alt='AWS VPC Diagram'
  width="100%"
  height="auto"
/>

### Create key pair

```
aws ec2 create-key-pair \
    --key-name ec2test \
    --key-type rsa \
    --key-format pem \
    --query "KeyMaterial" \
    --output text > keyname.pem
```
