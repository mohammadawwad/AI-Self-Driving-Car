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

        //user controls object
        this.controls = new Controls();
    }

    //method that draws the car
    draw(ctx){
        //allows for the rotation of the car to happen
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        //rectangle representing the car
        ctx.beginPath();
        ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fill();

        ctx.restore();
    }

    //method that updates the cars graphics through the following private methods
    update(){
        this.#verticleMovement();
        this.#horizontalMovement();
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

