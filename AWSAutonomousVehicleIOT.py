#!/usr/bin/python
# Replace aws_rest_endpoint with your AWS IoT endpoint dns name
# Replace the ca_path, cert_path and key_path with the credentials to you created with the AWS IoT service
# Replace your vehicleid and wheel_travel with your vehicle information
# DynamoDB TTL is set for 30 days for expiration
# battery_capacity is an arbitrary number
# Replace vehicle_topic with the AWS IoT that you want to send the telemetry to


import time
from time import sleep
import json
import random
import uuid
import datetime
import paho.mqtt.client as paho
import ssl
import rightfrontwheel
import leftfrontwheel
import rightrearwheel
import leftrearwheel

# Fill out this area with AWS account specific details
aws_rest_endpoint = "youriotendpoint.iot.us-east-1.amazonaws.com"
awsport = 8883

# Location of Certificates
ca_path = "/home/pi/d2/creds/VeriSign-Class 3-Public-Primary-Certification-Authority-G5.pem"
cert_path = "/home/pi/d2/creds/avaws01.donkeycar.cert.pem"
key_path = "/home/pi/d2/creds/avaws01.donkeycar.private.key"

connflag = False


def on_connect(client, userdata, flags, rc):
    global connflag
    connflag = True
    print("Connection returned result: " + str(rc))


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    print(Iot_Topic+str(msg.payload))


def getTime():
    currenttime = time.localtime()
    return (time.strftime("%Y%m%d%H%M%S", currenttime))


def drivetelemetry():

    vehicleid = "avaws01"
    actualtime = getTime()
    unixtime = str(datetime.datetime.now())
    event = uuid.uuid4()
    eventid = event.hex
    dynamodb_ttl = int(time.time()) + 2592000
    wheel_travel = 9.5
    feet = 12
    wheel_rotations_per_mile = 63360
    speed_reset = random.randint(1, 9)
    battery_capacity = 5320
    right_front_wheel_rpm = int(rightfrontwheel.get_wheelrpm())
    right_front_wheel_odometer = round((rightfrontwheel.get_wheeldistance())/feet, 2)
    right_front_wheel_distance = right_front_wheel_rpm * wheel_travel
    right_front_wheel_mpm = right_front_wheel_distance / wheel_rotations_per_mile
    right_front_wheel_mph = right_front_wheel_mpm * 60
    right_front_wheel_speed = round(right_front_wheel_mph)
    right_front_wheel_data = {"right_front_speed": right_front_wheel_speed, "right_front_rpm": right_front_wheel_rpm, "right_front_wheel_odometer": right_front_wheel_odometer}
    left_front_wheel_rpm = int(leftfrontwheel.get_wheelrpm())
    left_front_wheel_odometer = round((leftfrontwheel.get_wheeldistance())/feet, 2)
    left_front_wheel_distance = left_front_wheel_rpm * wheel_travel
    left_front_wheel_mpm = left_front_wheel_distance / wheel_rotations_per_mile
    left_front_wheel_mph = left_front_wheel_mpm * 60
    left_front_wheel_speed = round(left_front_wheel_mph)
    left_front_wheel_data = {"left_front_speed": left_front_wheel_speed, "left_front_rpm": left_front_wheel_rpm, "left_front_wheel_odometer": left_front_wheel_odometer}

    right_rear_wheel_rpm = int(rightrearwheel.get_wheelrpm())
    right_rear_wheel_odometer = round((rightrearwheel.get_wheeldistance())/feet, 2)
    right_rear_wheel_distance = right_rear_wheel_rpm * wheel_travel
    right_rear_wheel_mpm = right_rear_wheel_distance / wheel_rotations_per_mile
    right_rear_wheel_mph = right_rear_wheel_mpm * 60
    right_rear_wheel_speed = round(right_rear_wheel_mph)
    right_rear_wheel_data = {"right_rear_speed": right_rear_wheel_speed, "right_rear_rpm": right_rear_wheel_rpm, "right_rear_wheel_odometer": right_rear_wheel_odometer}

    left_rear_wheel_rpm = int(leftrearwheel.get_wheelrpm())
    left_rear_wheel_odometer = round((leftrearwheel.get_wheeldistance())/feet, 2)
    left_rear_wheel_distance = left_rear_wheel_rpm * wheel_travel
    left_rear_wheel_mpm = left_rear_wheel_distance / wheel_rotations_per_mile
    left_rear_wheel_mph = left_rear_wheel_mpm * 60
    left_rear_wheel_speed = round(left_rear_wheel_mph)
    left_rear_wheel_data = {"left_rear_speed": left_rear_wheel_speed, "left_rear_rpm": left_rear_wheel_rpm, "left_rear_wheel_odometer": left_rear_wheel_odometer}

    vehicle_speed = int((right_front_wheel_speed + right_rear_wheel_speed + left_front_wheel_speed + left_rear_wheel_speed)/4)
    average_wheel_rpm = int((right_front_wheel_rpm + right_rear_wheel_rpm + left_front_wheel_rpm + left_rear_wheel_rpm)/4)
    vehicle_odometer = ((right_front_wheel_odometer + right_rear_wheel_odometer + left_front_wheel_odometer + left_rear_wheel_odometer)/4)
    remaining_power = int(battery_capacity - vehicle_odometer)
    engine_rpm = int(average_wheel_rpm * 11)

    # JSON Key/Value pairs of telemetry
    vehiclepayload = json.dumps(
      {
       "vehicleid": vehicleid,
       "eventid": eventid,
       "time": actualtime,
       "timestamp": unixtime,
       "average_wheel_rpm": average_wheel_rpm,
       "engine_rpm": engine_rpm,
       "vehicle_speed": vehicle_speed,
       "vehicle_odometer": vehicle_odometer,
       "remaining_power": remaining_power,
       "right_front_wheel_rpm": right_front_wheel_rpm,
       "left_front_wheel_rpm": left_front_wheel_rpm,
       "right_rear_wheel_rpm": right_rear_wheel_rpm,
       "left_rear_wheel_rpm": left_rear_wheel_rpm,
       "right_front_wheel_speed": right_front_wheel_speed,
       "left_front_wheel_speed": left_front_wheel_speed,
       "right_rear_wheel_speed": right_rear_wheel_speed,
       "left_rear_wheel_speed": left_rear_wheel_speed,
       "right_front_wheel_odometer": right_front_wheel_odometer,
       "left_front_wheel_odometer": left_front_wheel_odometer,
       "right_rear_wheel_odometer": right_rear_wheel_odometer,
       "left_rear_wheel_odometer": left_rear_wheel_odometer,
       "dynamodb_ttl": dynamodb_ttl
            }
     )

    # print (vehiclepayload)
    return(vehiclepayload)

# Logging can be enabled by uncommenting below

# def on_log(client, userdata, level, buf):
    # print(msg.topic+" "+str(msg.payload))
    # print(Iot_Topic +str(msg.payload))
mqttc = paho.Client()
mqttc.on_connect = on_connect
mqttc.on_message = on_message
# mqttc.on_log = on_log

mqttc.tls_set(ca_path, certfile=cert_path, keyfile=key_path, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2, ciphers=None)
mqttc.connect(aws_rest_endpoint, awsport, keepalive=60)

# Begin reading sensor telemetry
mqttc.loop_start()

# drivetelemetry()
for r in range(10000000):
    # Sending telemetry to AWS IoT Service
    vehicle_topic = "/topics/DonkeyCars/AVAWS01"
    telemetry_payload = drivetelemetry()
    print(telemetry_payload)
    mqttc.publish(vehicle_topic, telemetry_payload,  1)
    sleep(1)
