%%sh

# Update the image variable with your Robocar name (must use all lowercase)
image=pinkysbrain1
cd /home/ec2-user/SageMaker/donkey/sagetrain/container

#!/usr/bin/env bash

# This script shows how to build the Docker image and push it to ECR to be ready for use
# by SageMaker.

# The argument to this script is the image name. This will be used as the image on the local
# machine and combined with the account and region to form the repository name for ECR.

# if [ "$image" == "" ]
#then
#    echo "Usage: $0 <image-name>"
#    exit 1
#fi

chmod +x customkeras/train

# Get the account number associated with the current IAM credentials
account=$(aws sts get-caller-identity --query Account --output text)

if [ $? -ne 0 ]
then
    exit 255
fi

# Get the region defined in the current configuration (default to us-west-2 if none defined)
region=$(aws configure get region)
region=${region:-us-west-2}

fullname="${account}.dkr.ecr.${region}.amazonaws.com/${image}:latest"

# If the repository doesn't exist in ECR, create it.
aws ecr describe-repositories --repository-names "${image}" > /dev/null 2>&1
if [ $? -ne 0 ]
then
    aws ecr create-repository --repository-name "${image}" > /dev/null
fi

# Get the login command from ECR and execute it directly
sudo $(aws ecr get-login --region ${region} --no-include-email)

# Build the docker image locally with the image name and then push it to ECR
# with the full name.

# On a SageMaker Notebook Instance, the docker daemon may need to be restarted in order
# to detect your network configuration correctly.  (This is a known issue.)
if [ -d "/home/ec2-user/SageMaker" ]; then
  sudo service docker restart
fi

# Build your Docker image using the following command.
sudo docker build  -t ${image} .

# After the build completes, tag your image so you can push the image to this repository:
sudo docker tag ${image} ${fullname}

# push this image to your newly created AWS repository:
sudo docker push ${fullname}
