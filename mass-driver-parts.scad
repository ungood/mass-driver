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

module loose_tube(length) {
    outer_diameter = tube_diameter + nozzle_diameter + loose_fit;
    
    tube(outer_diameter, outer_diameter + nozzle_diameter, length);
}

module base(inner_diameter, outer_diameter, thickness) {
    difference() {
        cylinder(d = outer_diameter, h = thickness);
        translate([0, 0, -epsilon])
        cylinder(d = inner_diameter, h = thickness + epsilon * 2);
    }
}
