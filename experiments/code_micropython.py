from microbit import *

safety_delay_ms = 5000

def nop():
    pass


class Magnet:
    def __init__(self, number):
        self.number = number

    def on(self):
        display.set_pixel(self.number, 2, 9)

    def off(self):
        display.set_pixel(self.number, 2, 9)


class Sensor:
    def __init__(self, pin):
        self.pin = pin

    def on_triggered(self, event):
        input.on_pin_pressed(self.pin, event)

    def disable(self):
        input.on_pin_pressed(self.pin,nop)


class Coil:
    def __init__(self, magnet, sensor, next_coil = None):
        self.magnet = magnet
        self.sensor = sensor
        self.next_coil = next_coil

    def on(self):
        self.sensor.on_triggered(self.off)
        self.magnet.on()
        sleep(safety_delay_ms)
        self.magnet.off()

    def off(self):
        self.magnet.off()
        if self.next_coil is not None:
            self.next_coil.on()
        self.sensor.disable()

coil_2 = Coil(Magnet(2), Sensor(pin2))

coil_1 = Coil(Magnet(1), Sensor(pin1), coil_2)

coil_0 = Coil(Magnet(0), Sensor(pin0), coil_1)


input.on_logo_event(TouchButtonEvent.PRESSED, coil_0.on)
