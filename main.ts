interface Magnet {
    readonly safetyDelay: number;
    on(): void;
    off(safetyDelay: boolean): void;
}

class Electromagnet implements Magnet {
    readonly name: string;
    readonly pin : DigitalPin;
    readonly safetyDelay: number = 500;

    constructor(name: string, pin : DigitalPin) {
        this.name = name;
        this.pin = pin;
    }

    public on() {
        serial.writeString(this.name.concat(" on\n"));

        pins.digitalWritePin(this.pin, 1);
    }

    public off(safetyDelay: boolean) {
        pins.digitalWritePin(this.pin, 0);

        if(safetyDelay) {
            serial.writeString(this.name.concat(" timed out\n"));
        } else {
            serial.writeString(this.name.concat(" turned off\n"));
        }
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
    
    public off(safetyDelay: boolean) {
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
    readonly name: string;
    readonly pin: DigitalPin;

    constructor(name: string, pin: DigitalPin) {
        this.name = name;
        this.pin = pin;
        pins.setPull(this.pin, PinPullMode.PullUp);
        this.disable();
    }

    public onTriggered(body: () => void) {
        serial.writeString(this.name.concat(" enabled\n"));

        pins.onPulsed(this.pin, PulseValue.Low, () => {
            serial.writeString(this.name.concat(" triggered\n"));
            body();
        });
    }

    public disable() {
        //serial.writeString(this.name.concat(" disabled\n"));

        pins.onPulsed(this.pin, PulseValue.High, () => {
            //serial.writeString(this.name.concat(" ignored\n"));
        });
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
        this.magnet.off(true);
    }

    public off() {
        this.sensor.disable();
        this.magnet.off(false);

        if (this.nextCoil) {
            this.nextCoil.on();
        }
    }
}

// Mock Mass Driver
// let coil2 = new Coil(new Magnet(2), new TouchSensor(TouchPin.P2));
// let coil1 = new Coil(new Magnet(1), new TouchSensor(TouchPin.P1), coil2);
// let coil0 = new Coil(new Magnet(0), new TouchSensor(TouchPin.P0), coil1);

serial.writeString("Initializing\n");

led.enable(false);
serial.setBaudRate(BaudRate.BaudRate115200);

let coil2 = new Coil(
    new Electromagnet("M2", DigitalPin.P8),
    new HallSensor("H2", DigitalPin.P2)
);
let coil1 = new Coil(
    new Electromagnet("M1", DigitalPin.P7),
    new HallSensor("H1", DigitalPin.P1),
    coil2
);
let coil0 = new Coil(
    new Electromagnet("M0", DigitalPin.P6),
    new HallSensor("H0", DigitalPin.P0),
    coil1
);

function start() {
    input.onLogoEvent(TouchButtonEvent.Pressed, () => {});
    serial.writeString("START\n");
    
    if(!input.buttonIsPressed(Button.A)) {
        for (let i = 0; i < 4; i++) {
            music.playMelody("C5 B A B C5 B A B ", 400)
        }
    }

    input.onLogoEvent(TouchButtonEvent.Pressed, start);
    coil0.on();
}

input.onLogoEvent(TouchButtonEvent.Pressed, start);

serial.writeString("Initialized\n");