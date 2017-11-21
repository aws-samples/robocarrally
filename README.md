## Robocarrally

The two python files are designed to be run on a raspberrypi and send wheel rotationtelemetry to the AWS IoT Service.
Create a wheelsensor.py for each wheel that you want to measure. The AWSAutonomousVehicleIOT.py references each of these wheel sensors.

The Donkey Dashboard is a static website that can run on S3. It uses anonomous connectivity to the AWS IoT service using AWS Cognito Identity Pools.

Modify the scripts/main.js and change the IOTENDPOINT to your AWS IoT endpoint. Change the COGNITO_IDENTITY_POOL to your Cognito Identify Pool.

Modify the TOPIC to reflect your AWS IoT Topic.

## License

This library is licensed under the Apache 2.0 License. 
