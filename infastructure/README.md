# Infastructure

## Overview

- CDK: Used to deploy infastructure on AWS.
- GitHub action: deploy.yml runs on change to app folder. Builds + tests app and creates CodeDeploy deployment from S3.

Note: App Load Balancer and NAT Gateways have provisioned hourly costs even when idle

## Architecture Diagram

<img
  src='../diagrams/backend_diagram.png'
  raw=true
  alt='AWS Backend Architecture Diagram'
  width="100%"
  height="auto"
/>

VPC

<img
  src='../diagrams/vpc_diagram.png'
  raw=true
  alt='AWS VPC Diagram'
  width="100%"
  height="auto"
/>
