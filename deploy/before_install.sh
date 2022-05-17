#!/bin/bash
cd /home/ubuntu/tennisapi
npm run kill
rm -rf .[a-zA-Z_-]* ./*
aws s3 cp s3://server-release/env ./.env