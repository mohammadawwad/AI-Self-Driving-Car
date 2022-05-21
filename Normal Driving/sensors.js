class Sensors {

    constructor(car){
        //specifity ray details
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2;

        //array of rays
        this.rays = [];

        //array for keeping track of roadBorders
        this.readings = [];
    }

    update(roadBorders, traffic) {
       this.#showRays();

       //loops overs the sensors to see if it has detected anything
       this.readings = [];
       for(let i = 0; i < this.rays.length; i++){
           this.readings.push(
               this.#getReadings(this.rays[i], roadBorders, traffic)
           )
       }
    }


    //method for drawing the rays
    draw(ctx) {
        for(let i = 0; i < this.rayCount; i++) {

            //returns either the normal length or the length from the sensor to a detected object
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            //draws the normal sensor rays
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";

            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
            );

            ctx.lineTo(
                end.x,
                end.y
            );

            ctx.stroke();


            //draws the expected length of the ray in black starting from the tip
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";

            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );

            ctx.lineTo(
                end.x,
                end.y
            );

            ctx.stroke();
        }
    }

    #showRays() {
        this.rays = [];

        //loops over the raysCount to actually make them
        for(let i = 0; i < this.rayCount; i++) {

            //decides what the angle of the ray will be
            const rayAngle = lerp(
                this.raySpread / 2, 
                -this.raySpread / 2, 
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
            
            ) + this.car.angle;

            //screating the start and end position of each ray
            const start = {x: this.car.x, y: this.car.y};
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    #getReadings(ray, roadBorders, traffic) {
        let touches = [];

        //addes if any borders have been detected 
        for(let i = 0; i < roadBorders.length; i++){
            const touched = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);

            if(touched){
                touches.push(touched);
            }
        }

        
        //addes if any traffic has been detected 
        for(let i = 0; i < traffic.length; i++){
            const poly = traffic[i].polygon;
            
            for(let j = 0; j < poly.length; j++){
                const touched = getIntersection(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]);

                if(touched){
                    touches.push(touched);
                }
            }
        }

        //nothing detedcted
        if(touches.length == 0) {
            return null;
        } else {
            //returns an array called offset
            const offsets = touches.map(e => e.offset)
         
            //accounts for the intersecting point closset to the car based off the offset array
            const minOffset = Math.min(...offsets)

            //returns the closset interection offset
            return touches.find(e => e.offset == minOffset);
        }
    }

}
