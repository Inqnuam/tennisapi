rm -rf node_modules logs .env .git
zip -r express.zip .
aws s3 cp express.zip s3://server-release