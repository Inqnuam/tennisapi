#!/bin/bash
cd /home/ubuntu/tennisapi
npm run kill
mv ./.env /home/ubuntu/.env
rm -rf ./*
mv /home/ubuntu/.env ./.env