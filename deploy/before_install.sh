#!/bin/bash
cd /home/ubuntu/tennisapi
sudo npm run kill
sudo mv ./.env /home/ubuntu/.env
sudo rm -rf .[a-zA-Z_-]*
sudo rm -rf ./*
sudo mv /home/ubuntu/.env ./.env