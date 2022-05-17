rm -rf node_modules logs .env .git
zip -r express.zip .
aws s3 cp express.zip s3://server-release

aws deploy create-deployment --application-name TennisCodeDeploy --deployment-config-name TennisCodeDeploy --deployment-group-name TennisCodeDeploy --s3-location bucket=server-release,key=express.zip,bundleType=zip