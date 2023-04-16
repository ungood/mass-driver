/**
 * Creates a plate for 3 relay enclosures to sit upon.
 */
 

include <./mass-driver-parts.scad>

enclosure_length = 76.75;
enclosure_width  = 26.00;
enclosure_height = 9.00;
tab_width = 5.00;

radius = 2.0;
spacing = 5;
thickness = layer_height * 10;
inset = layer_height * 7;

text = "HIGH VOLTAGE";
text_length = 100;
text_width = 20;
text_inset = layer_height * 2;

module round_cube(width, length, height, radius) {
    x_offset = width / 2;
    y_offset = length  / 2;
    
    hull() {
        for(x = [-1, 1]) {
            for(y = [-1, 1]) {
                translate([x * x_offset, y * y_offset, 0])
                cylinder(r = radius, h = height);
            }
        }
    }
}

module enclosure() {
    x_offset = (enclosure_width + loose_fit - radius) / 2;
    y_offset = (enclosure_length + loose_fit - radius) / 2;
    radius = radius + loose_fit / 2;
    
    round_cube(
        enclosure_width + loose_fit,
        enclosure_length + loose_fit,
        enclosure_height
    );
    
    hull() {
        translate([0, 0, enclosure_height - 0.05])
        cube([enclosure_width + loose_fit + tab_width * 2, tab_width, 0.1], center = true);
        translate([0, 0, 0.51])
        cube([enclosure_width + loose_fit *2, tab_width, 1], center = true);
    }
}

module enclosures() {
    x_offset = (enclosure_width) + (tab_width * 2) - epsilon;
    for(x = [-1, 0, 1]) {
        translate([x * x_offset, 0, 0])
        enclosure();
    }
}

module plate() {
    width = (enclosure_width * 3) + (tab_width * 4) + (spacing * 2);
    length = enclosure_length + (spacing * 2) + text_width;
    round_cube(width, length, thickness, radius);
}

difference() {
    plate();
    translate([0, text_width / 2, thickness - inset])
    enclosures();
    translate([-text_length / 2, -(enclosure_length + text_width) / 2, thickness - text_inset])
    linear_extrude(1.0)
    text("HIGH VOLTAGE");
}




//enclosure_silhouette();