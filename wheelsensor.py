#Create 1 file per wheel and change hallgpio  to represent the physical GPIO connection that you are using.

#### wheel mappings ######
## right front wheel 26 ##
## right rear wheel 19 ###
## left front wheel 20 ###
## left rear wheel 16  ####
##########################


import RPi.GPIO as GPIO
import time
from time import sleep
import multiprocessing

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

magnetdetection = 0
distancetraveled = 0
revolutions = 0
wheelspeed = 0
wheel_in = 9.5
hallgpio = 19
elapsedtime = 0.00

start = time.time()

GPIO.setup(hallgpio, GPIO.IN, pull_up_down = GPIO.PUD_UP)


def get_revolutions():
    return revolutions

def get_wheelspeed():
    return wheelspeed

def get_distancetraveled():
    return distancetraveled

def get_elapsedtime():
    return elapsedtime

def get_magnetdetection(number):
    global elapsedtime,distancetraveled,start,magnetdetection,wheelspeed,revolutions,multiplier
    rotation = 0
    magnetdetection+=1
    rotation+=1
    #revolutions = 0
    if magnetdetection > 0:
        elapsedtime = time.time() - start
        #print ('LeftRearContact')
        magnetdetection -=1
    if rotation > 0:
        distancetraveled += wheel_in
        #print ('rotation is ' , rotation)
        rotation -= 1

    revolutions = 1/elapsedtime *60
    start = time.time()
    sleep(.001)

try:
    GPIO.add_event_detect(hallgpio,GPIO.FALLING,callback = get_magnetdetection,bouncetime=250)
    #GPIO.cleanup()
except KeyboardInterrupt:50
#except elapsedtime < 1:
    GPIO.cleanup()