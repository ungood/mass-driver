safety_delay_ms = 5000

def nop():
    pass


class Magnet():
    def __init__(self, number):
        self.number = number

    def on(self):
        led.plot(self.number, 2)

    def off(self):
        led.unplot(self.number, 2)


class Sensor:
    def __init__(self, pin):
        self.pin = pin

    def on_triggered(self, magnet: Magnet):
        input.on_pin_pressed(self.pin, magnet.on)

    def disable(self):
        input.on_pin_pressed(self.pin, nop)


magnet0 = Magnet(0)
sensor0 = Sensor(TouchPin.P0)

sensor0.on_triggered(magnet0)


# def turn_on_magnet(magnet_number):
#     led.plot(magnet_number, 2)

# def turn_off_magnet(magnet_number):
#     led.unplot(magnet_number, 2)

# def turn_on_magnet_0():
#     turn_on_magnet(0)
#     basic.pause(safety_delay_ms)
#     turn_off_magnet(0)
    
# def turn_off_magnet_0():
#     turn_off_magnet(0)
#     turn_on_magnet(1)

# def turn_on_magnet_1():
#     turn_on_magnet(1)
#     basic.pause(safety_delay_ms)
#     turn_off_magnet(1)

# def turn_off_magnet_1():
#     turn_off_magnet(1)
#     turn_on_magnet(2)

# def turn_on_magnet_2():
#     turn_on_magnet(2)
#     basic.pause(safety_delay_ms)
#     turn_off_magnet(2)

# def turn_off_magnet_2():
#     turn_off_magnet(2)


# input.on_logo_event(TouchButtonEvent.PRESSED, turn_on_magnet_0)

# def on_button_pressed_a():
#     basic.show_string("A")
#     basic.pause(1000)
#     basic.clear_screen()
#     input.on_button_pressed(Button.A, nop)

# input.on_button_pressed(Button.A, on_button_pressed_a)

# input.on_pin_pressed(TouchPin.P0, turn_off_magnet_0)
# #pins.on_pulsed(DigitalPin.P0, PulseValue.HIGH, turn_on_magnet_0)

# #input.on_button_pressed(Button.A, turn_on_magnet_1)

# input.on_pin_pressed(TouchPin.P1, turn_off_magnet_1)

# #input.on_button_pressed(Button.A, turn_on_magnet_2)

# input.on_pin_pressed(TouchPin.P2, turn_off_magnet_2)