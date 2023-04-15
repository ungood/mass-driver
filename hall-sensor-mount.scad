include <./mass-driver-parts.scad>;

hall_sensor_length = 18.7;
hall_sensor_width = 15.3;

module table(thickness) {
    length = hall_sensor_length + (tube_diameter / 2);
    translate([0, length / 2, thickness / 2])
    cube([hall_sensor_width, length, thickness], center = true);
}

module hall_sensor_mount() {
    loose_tube(10);
    
    difference(){
        table(0.8);
        translate([0, 0, -epsilon])
        cylinder(h=1, r=(tube_diameter + nozzle_diameter + loose_fit) / 2);
    }
}

hall_sensor_mount();