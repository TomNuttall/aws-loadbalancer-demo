#!/bin/bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.bashrc
nvm install node
npm install yarn -g
source ~/.bashrc
yarn global add pm2
cd app
yarn install