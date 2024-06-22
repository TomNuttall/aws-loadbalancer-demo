#!/bin/bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source ~/.bashrc
nvm install --lts
sudo chown -R $USER:$USER app
npm install -g pm2
cd app
npm install