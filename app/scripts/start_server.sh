#!/bin/bash
cd /home/ec2-user/app
export SERVER_ID=`hostname`
pm2 start dist/server.js