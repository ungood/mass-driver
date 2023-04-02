let safety_delay_ms = 5000;


class Magnet {
    readonly number: number;

    constructor(number: number) {
        this.number = number;
    }

    public on() {
        led.plot(this.number, 2);
    }
    
    public off() {
        led.unplot(this.number, 2);
    }
}

interface DigitalSensor {
    onTriggered(body: () => void): void;
    disable(): void;
}

class TouchSensor implements DigitalSensor {
    readonly pin: TouchPin;

    constructor(pin: TouchPin) {
        this.pin = pin;
    }
    
    public onTriggered(body: () => void) {
        input.onPinPressed(this.pin, body);
    }
    
    public disable() {
        input.onPinPressed(this.pin, () => {});
    }
}

class HallSensor implements DigitalSensor {
    readonly pin: DigitalPin;

    constructor(pin: DigitalPin) {
        this.pin = pin;
        pins.setPull(this.pin, PinPullMode.PullUp);
    }

    public onTriggered(body: () => void) {
        pins.onPulsed(this.pin, PulseValue.High, body);
    }

    public disable() {
        pins.onPulsed(this.pin, PulseValue.Low, () => {});
    }
}

class Coil {
    readonly magnet: Magnet;
    readonly sensor: DigitalSensor;
    readonly nextCoil: Coil;

    constructor(magnet: Magnet, sensor: DigitalSensor, nextCoil: Coil = null) {
        this.magnet = magnet;
        this.sensor = sensor;
        this.nextCoil = nextCoil;
    }

    public on() {
        this.sensor.onTriggered(() => this.off());
        this.magnet.on();
        basic.pause(safety_delay_ms);
        this.magnet.off();
    }

    public off() {
        this.sensor.disable();
        this.magnet.off();

        if (this.nextCoil) {
            this.nextCoil.on();
        }
    }
}


// Mock Mass Driver
// let coil2 = new Coil(new Magnet(2), new TouchSensor(TouchPin.P2));
// let coil1 = new Coil(new Magnet(1), new TouchSensor(TouchPin.P1), coil2);
// let coil0 = new Coil(new Magnet(0), new TouchSensor(TouchPin.P0), coil1);

// Real Mass Driver
let coil2 = new Coil(new Magnet(2), new HallSensor(DigitalPin.P2));
let coil1 = new Coil(new Magnet(1), new HallSensor(DigitalPin.P1), coil2);
let coil0 = new Coil(new Magnet(0), new HallSensor(DigitalPin.P0), coil1);

input.onLogoEvent(TouchButtonEvent.Pressed, () => coil0.on());