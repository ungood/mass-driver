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


class Sensor {
    readonly pin: number;

    constructor(pin: number) {
        this.pin = pin;
    }
    
    public on_triggered(body: () => void) {
        input.onPinPressed(this.pin, body);
    }
    
    public disable() {
        input.onPinPressed(this.pin, () => {});
    }
}    

class Coil {
    readonly magnet: Magnet;
    readonly sensor: Sensor;
    readonly next_coil: Coil;

    constructor(magnet: Magnet, sensor: Sensor, next_coil: Coil = null) {
        this.magnet = magnet;
        this.sensor = sensor;
        this.next_coil = next_coil;
    }

    public on() {
        this.sensor.on_triggered(() => this.off());
        this.magnet.on();
        basic.pause(safety_delay_ms);
        this.magnet.off();
    }

    public off() {
        this.sensor.disable();
        this.magnet.off();

        if(this.next_coil) {
            this.next_coil.on();
        }
    }
}

let coil2 = new Coil(new Magnet(2), new Sensor(TouchPin.P2));
let coil1 = new Coil(new Magnet(1), new Sensor(TouchPin.P1), coil2);
let coil0 = new Coil(new Magnet(0), new Sensor(TouchPin.P0), coil1);

input.onLogoEvent(TouchButtonEvent.Pressed, () => coil0.on());