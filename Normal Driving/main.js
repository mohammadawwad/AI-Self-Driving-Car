const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");


//creating a road and car object
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

//creating an array of cars for traffic, make sure to specify is is traffic and its speed
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 2)
]

//repeativly calls the animate function
animate();

//animates the car to allow it to moveby repainting and errasing
function animate(){

    //updates the borders for traffic
    for(let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders)
    }

    //border for the original car
    car.update(road.borders);

    //stretching full screen vertically, its in here as it will constantly be called and will be responsive
    canvas.height = window.innerHeight;

    //make a camera follow the car
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.7)

    //draws the car and road
    road.draw(ctx);
    car.draw(ctx);

    //drawing the traffic cars
    for(let i =0; i < traffic.length; i++) {
        traffic[i].draw(ctx);
    }
    
    ctx.restore();
    requestAnimationFrame(animate);
}

