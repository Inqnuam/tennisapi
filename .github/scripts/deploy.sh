rm -rf node_modules logs .env .git
zip -r express.zip .
aws s3 cp express.zip s3://server-release
aws deploy create-deployment \
    --cli-input-json .github/scripts/deploy.json \
    --region eu-west-3