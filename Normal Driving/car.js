class Car {

    constructor(x, y, width, height, controlType, maxSpeed = 3.5) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //used for driving mechanics
        this.speed = 0;
        this.maxSpeed = maxSpeed;
        this.acceleration = 0.2;
        this.friction = 0.05;
        this.angle = 0;

        //collision variable
        this.damaged = false;

        //allows for the neural network to control the car 
        this.useNeuarlBrain = controlType == "AI";

        //only allowing the controled car to have sensors
        if (controlType != "TRAFFIC") {
            //sensor object, with the car as a parameter
            this.sensors = new Sensors(this);

            //array of neuron counts
            this.brain = new NeuralNetwork([this.sensors.rayCount, 6, 4]);
        }

        //user controls object
        this.controls = new Controls(controlType);
    }

    //method that updates the cars graphics through the following private methods
    update(roadBorders, traffic) {

        //only lets you move the car if itsnt damaged
        if (!this.damaged) {
            //car physics 
            this.#verticleMovement();
            this.#horizontalMovement();

            //hitbox and checks if it is damaged by the border or traffic
            this.polygon = this.#createPolygon();
            this.damaged = this.#checkForDamage(roadBorders, traffic);
        }

        //updating the sensor to recognise borders and traffic, if the snsor object exists
        if (this.sensors) {
            this.sensors.update(roadBorders, traffic);
            
            //giving the neuron low values if far, and hight values when close
            const offsets = this.sensors.readings.map(
                s => s == null ? 0 : 1 - s.offset
            );

            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            console.log(outputs);

            if(this.useNeuarlBrain){
                //the position in which is turned on that controls each function, it can be seen in the console log above
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    //method that draws the car
    draw(ctx, color) {

        //changes the cars color depending on if it has crashed
        if (this.damaged == true) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = color;
        }

        ctx.beginPath();

        //drawing the first polygon points
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

        //looping over all polygon points array to finish the drawing
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }

        //filling in the rectangle
        ctx.fill();

        //car having the responsibility for drawing its sensors if the object exists
        if (this.sensors) {
            this.sensors.draw(ctx);
        }

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
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
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

    #checkForDamage(roadBorders, traffic) {

        //loops over all the borders
        for (let i = 0; i < roadBorders.length; i++) {

            //if ther is an intersection between the polygon hitbox and the border we will set the car to be damaged
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        //loops over all the traffic
        for (let i = 0; i < traffic.length; i++) {

            //if ther is an intersection between the polygon hitbox and traffic we will set the car to be damaged
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }

        return false;
    }


    #verticleMovement() {
        //the acceleration allows it to feel smother and more netural
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }

        //setting max forward and backward speed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        }
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2;
        }

        //implementing friction when it moves
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }

        //stops the friction speed it is greater than the cars
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        //making forward go in the direction based off the cars angle
        this.y -= Math.cos(this.angle) * this.speed;
    }

    #horizontalMovement() {
        //flips controls for backwards driving
        if (this.speed != 0) {
            const flip = (this.speed > 0) ? 1 : -1;

            if (this.controls.left) {
                this.angle += 0.03 * flip;
            }

            if (this.controls.right) {
                this.angle -= 0.03 * flip;
            }
        }

        //making forward go in the direction based off the cars angle
        this.x -= Math.sin(this.angle) * this.speed;
    }
}
