include <./mass-driver-parts.scad>;

base_diameter = tube_diameter + 5;
base_height = 10;

num_arms = 3;

module holder() {
    inner_diameter = 6; // 1/4" in mm
    outer_diameter = tube_diameter + loose_fit;
    
    tube(inner_diameter, outer_diameter, base_height);
}

module arm(length = 100) {
    translate([0, length / -2, 0])
    hull() {
        cube([base_diameter, length, 1], center = true);
        translate([0, (length - base_diameter)/2, base_height - 1])
        cube([base_diameter, base_diameter, 1], center = true);
    }
}

module arms(){
    for(i = [0 : num_arms]) {
        rotate([0, 0, (360 / num_arms) * i])
        arm();
    }
}

module the_whole_dohicky(){
    difference(){
        arms();
        translate([0, 0, layer_height * 4])
        holder();
    }
}
the_whole_dohicky();