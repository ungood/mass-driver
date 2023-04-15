include <./mass-driver-parts.scad>

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
    loose_tube(length);
}

half_coil(50, 9);
//half_coil(30, 5.513);
//half_coil(15, 8.820);