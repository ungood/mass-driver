use <./mass-driver-parts.scad>;

tube_inner_diameter = 10.0;
tube_length = 18;
tube_outer_diameter = tube_inner_diameter + 5;

hall_sensor_length = 18.7;
hall_sensor_width = 15.3;

wall_height = 2;
wall_thickness = 1;

module sides(wall_thickness, wall_height, hall_sensor_width, hall_sensor_length){
    rotate([0, -90, 90]){
        difference(){
            cube([
                wall_height,
                hall_sensor_width+wall_thickness,
                hall_sensor_length+wall_thickness
            ], center=true);
            cube([
                wall_height,
                hall_sensor_width,
                hall_sensor_length
            ], center=true);
        }
    }
}

module table(tube_inner_diameter, tube_outer_diameter, tube_length, hall_sensor_legnth, hall_sensor_width, wall_thickness, wall_height){
    
    tube(tube_inner_diameter, tube_outer_diameter, tube_length);
    
    difference(){
        
        translate([hall_sensor_length / 2.44, 0, tube_outer_diameter / 2]){
            sides(wall_thickness, wall_height, hall_sensor_width, hall_sensor_length);
        }
        linear_extrude(20, center = true) circle(tube_inner_diameter / 2);
    
    }
}

table(tube_inner_diameter, tube_outer_diameter, tube_length, hall_sensor_length, hall_sensor_width, wall_thickness, wall_height);