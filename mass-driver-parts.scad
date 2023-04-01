$fn = 64;

nozzle_diameter = 0.4;

// outer diameter of the tube we're using.
tube_diameter = 10.0;

// Tolerances to add to an inner diameter so it fits over
tight_fit = 0.2;
loose_fit = 0.4;

epsilon = 0.01;

module tube(inner_diameter, outer_diameter, length){
    linear_extrude(length){
        difference(){
            circle(d = outer_diameter);
            circle(d = inner_diameter);
        }
    }
}



module base(inner_diameter, outer_diameter, thickness) {
    difference() {
        cylinder(d = outer_diameter, h = thickness);
        translate([0, 0, -epsilon])
        cylinder(d = inner_diameter, h = thickness + epsilon * 2);
    }
}


// Makes one half of a magnet coil winder.
// Print 2 for a full winder
// Use a calculator to find the length and height to use:
// https://www.accelinstruments.com/Magnetic/Magnetic-field-calculator.html
module half_coil(coil_length, coil_height) {
    coil_diameter = tube_diameter + nozzle_diameter + loose_fit;
    base_diameter = coil_diameter + coil_height;
    length = coil_length / 2;
    
    base_thickness = 2;
    base(coil_diameter, base_diameter, 1);
    tube(coil_diameter, coil_diameter + nozzle_diameter, length);
}

half_coil(50, 9);
//half_coil(30, 5.513);
//half_coil(15, 8.820);