class Car {

    //constructor with all required information for the car and sets the paramater as variables in the class
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        //used for driving mechanics
        this.speed = 0;
        this.speed = 3;
        this.acceleration = 0.2;
        this.friction = 0.05;

        //user controls object
        this.controls = new Controls();
    }

    //method that draws a recangle representing the car
    draw(ctx){
        ctx.beginPath();
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fill();
    }

    //method that updates the cars graphics
    update(){

        //the acceleration allows it to feel smother and more netural
        if(this.controls.forward){
            this.speed += this.acceleration;
        }

        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }


        //setting max forward speed
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }

        //seeting max backward speed
        if(this.speed < -this.maxSpeed / 2){
            this.speed = -this.maxSpeed / 2;
        }

        //implementing friction when it moves
        if(this.speed > 0){
            this.speed -= this.friction
        }

        if(this.speed < 0){
            this.speed += this.friction
        }

        //stops the friction speed it is greater than the cars
        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        this.y -= this.speed;
    }
}