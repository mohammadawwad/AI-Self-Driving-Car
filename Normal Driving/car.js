class Car {

    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //used for driving mechanics
        this.speed = 0;
        this.maxSpeed = 3.5;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.angle = 0;

        //collision variable
        this.damaged = false;

        //sensor object, with the car as a parameter
        this.sensors = new Sensors(this);

        //user controls object
        this.controls = new Controls();
    }

    //method that updates the cars graphics through the following private methods
    update(roadBorders){
        //car physics
        this.#verticleMovement();
        this.#horizontalMovement();

        //hitbox and checks if it is damaged
        this.polygon = this.#createPolygon();
        this.damaged = this.#checkForDamage(roadBorders);

        //updating the sensor as well
        this.sensors.update(roadBorders);
    }

    //method that draws the car
    draw(ctx){

        //changes the cars color depending on if it has crashed
        if(this.damaged == true) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green"
        }

        ctx.beginPath();

        //drawing the first polygon points
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        //looping over all polygon points array to finish the drawing
        for(let i = 1; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        //filling in the rectangle
        ctx.fill();

        //car having the responsibility for drawing its sensors
        this.sensors.draw(ctx);
    }

    //creating a hitbox useable for all shapes
    #createPolygon() {
        const points = [];

        //get the radius
        const rad = Math.hypot(this.width, this.height) / 2;

        //angle of triangle within the shap to the corner
        const alpha = Math.atan2(this.width, this.height);

        //multiple the radius in the points that are being pushed to change the shape of the polygon

        //top right point
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad * 3,
            y: this.y - Math.cos(this.angle - alpha) * rad * 3
        });

        //top left point
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });

        //bottom right point
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });

        //bottom left point
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });

        return points;
    }

    #checkForDamage(roadBorders) {

        //loops over all the borders
        for(let i = 0; i < roadBorders.length; i++){

            //if ther is an intersection between the polygon hitbox we will set the car to be damaged
            if(polysIntersect(this.polygon, roadBorders[i])){
                return true;
            }
        }

        return false;
    }


    #verticleMovement(){
        //the acceleration allows it to feel smother and more netural
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        //setting max forward and backward speed
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed / 2){
            this.speed = -this.maxSpeed / 2;
        }

        //implementing friction when it moves
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }

        //stops the friction speed it is greater than the cars
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        //making forward go in the direction based off the cars angle
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #horizontalMovement(){
        //flips controls for backwards driving
        if(this.speed != 0){
            const flip = (this.speed > 0) ? 1 : -1;

            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
    
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }

        //making forward go in the direction based off the cars angle
        this.x -= Math.sin(this.angle) * this.speed;
    }
}

