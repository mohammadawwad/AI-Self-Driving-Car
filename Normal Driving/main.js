//car canvas
const carCanvas = document.getElementById("CarCanvas");
carCanvas.width = 200;

//neural network canvas
const neuralNetworkCanvas = document.getElementById("NueralNetworkCanvas");
neuralNetworkCanvas.width = 400;

const carCTX = carCanvas.getContext("2d");
const neuralNetworkCTX = neuralNetworkCanvas.getContext("2d");

//creating a road and car object
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

// was "KEYS" before to be able to drive the car
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");

//creating an array of cars for traffic, make sure to specify is is traffic and its speed
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 2)
]

//repeativly calls the animate function
animate();

//animates the car to allow it to moveby repainting and errasing
function animate(time){

    //updates the borders for traffic
    for(let i = 0; i < traffic.length; i++) {
        //dont pass traffic as border or collision object as it will detect itself as hit so pass an empty array
        traffic[i].update(road.borders, [])
    }

    //border for the original car, and the traffic that must be avoided too
    car.update(road.borders, traffic);

    //stretching full screen vertically, its in here as it will constantly be called and will be responsive
    carCanvas.height = window.innerHeight;
    neuralNetworkCanvas.height = window.innerHeight;

    //make a camera follow the car
    carCTX.save();
    carCTX.translate(0, -car.y + carCanvas.height * 0.7)

    //draws the road
    road.draw(carCTX);

    //drawing the traffic cars
    for(let i =0; i < traffic.length; i++) {
        traffic[i].draw(carCTX, "blue");
    }

    //draws the controlled car
    car.draw(carCTX, "green");
    
    carCTX.restore();

    //visualising the neural network
    neuralNetworkCTX.lineDashOffset = -time / 50
    networkVisualizer.drawNetwork(neuralNetworkCTX, car.brain);
    requestAnimationFrame(animate);
}



