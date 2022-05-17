#!/bin/bash
cd /home/ubuntu/tennisapi
npm run kill
rm -rf .[a-zA-Z_-]*
rm -rf ./*
aws s3 cp s3://server-release/env ./.env