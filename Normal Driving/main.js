const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");

//creating a car object
const car = new Car(100, 100, 30, 50);
car.draw(ctx);

//repeativly calls the animate function
animate();

//animates the car to allow it to moveby repainting and errasing
function animate(){
    car.update();

    //stretching full screen vertically, its in here as it will constantly be called and will be responsive
    canvas.height = window.innerHeight;

    car.draw(ctx);
    requestAnimationFrame(animate);
}

