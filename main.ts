interface Magnet{
    readonly safetyDelay: number;
    on(): void;
    off(): void;
}

Kitronik_Robotics_Board.motorOn(Kitronik_Robotics_Board.Motors.Motor1, Kitronik_Robotics_Board.MotorDirection.Forward, 0)
Kitronik_Robotics_Board.motorOff(Kitronik_Robotics_Board.Motors.Motor1)

class Electromagnet implements Magnet {
    readonly motor : Kitronik_Robotics_Board.Motors;
    readonly ledNumber : number;
    readonly safetyDelay: number = 100;


    constructor(motor : Kitronik_Robotics_Board.Motors, ledNumber : number){
        this.motor = motor;
        this.ledNumber = ledNumber;
    }

    public on() {
        led.plot(this.ledNumber, 2);
        Kitronik_Robotics_Board.motorOn(
            this.motor,
            Kitronik_Robotics_Board.MotorDirection.Forward,
            100
        );
    }

    public off() {
        led.unplot(this.ledNumber, 2);
        Kitronik_Robotics_Board.motorOff(this.motor);

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

// Real Mass Driver
Kitronik_Robotics_Board.allOff();

let coil2 = new Coil(
    new Electromagnet(2, Kitronik_Robotics_Board.Motors.Motor3),
    new HallSensor(DigitalPin.P2)
);
let coil1 = new Coil(
    new Electromagnet(1, Kitronik_Robotics_Board.Motors.Motor2),
    new HallSensor(DigitalPin.P1),
    coil2
);
let coil0 = new Coil(
    new Electromagnet(0, Kitronik_Robotics_Board.Motors.Motor1),
    new HallSensor(DigitalPin.P0),
    coil1
);

input.onLogoEvent(TouchButtonEvent.Pressed, () => coil0.on());