interface Magnet{
    readonly safetyDelay: number;
    on(): void;
    off(): void;
}

class Electromagnet implements Magnet {
    readonly pin : DigitalPin;
    readonly safetyDelay: number = 250;

    constructor(pin : DigitalPin) {
        this.pin = pin;
    }

    public on() {
        pins.digitalWritePin(this.pin, 1);
    }

    public off() {
        pins.digitalWritePin(this.pin, 0);
    }
}

class TestMagnet implements Magnet {
    readonly number: number;
    readonly safetyDelay: number = 5000;

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
        pins.onPulsed(this.pin, PulseValue.Low, body);
    }

    public disable() {
        pins.onPulsed(this.pin, PulseValue.High, () => {});
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
        basic.pause(this.magnet.safetyDelay);
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


led.enable(false);

let coil2 = new Coil(
    new Electromagnet(DigitalPin.P8),
    new HallSensor(DigitalPin.P2)
);
let coil1 = new Coil(
    new Electromagnet(DigitalPin.P7),
    new HallSensor(DigitalPin.P1),
    coil2
);
let coil0 = new Coil(
    new Electromagnet(DigitalPin.P6),
    new HallSensor(DigitalPin.P0),
    coil1
);

input.onLogoEvent(TouchButtonEvent.Pressed, () => coil0.on());