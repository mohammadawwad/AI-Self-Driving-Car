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
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");

//generating multiple AI cars
const numberOfCars = 100;
const cars = generateCars(numberOfCars);

//gloabl variable for the best car, which will be set to the first car at the start
let bestCar = cars[0];

//parsing the best cars brain
if(localStorage.getItem("bestBrain")){

    //looping over the cars and giving them the previous neural network
    for(let i = 0; i < cars.length; i++){
        bestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));

        //mutating all the other cars to have some sort of variation based on the saved network, the variation depends on the amount value givwen bellow 
        if(i != 0){
            Neural.mutate(cars[i].brain, 0.1)
        }
    }
}

//creating an array of cars for traffic, make sure to specify is is traffic and its speed
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "TRAFFIC", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "TRAFFIC", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "TRAFFIC", 2),
    new Car(road.getLaneCenter(2), -550, 30, 50, "TRAFFIC", 2),
    new Car(road.getLaneCenter(0), -600, 30, 50, "TRAFFIC", 2),
    new Car(road.getLaneCenter(4), -700, 30, 50, "TRAFFIC", 2),
]

//repeativly calls the animate function
animate();

//generating cars for parallisation
function generateCars(numberOfCars){
    const cars = [];

    //creating the cars
    for(let i = 0; i <= numberOfCars; i++){
        cars.push(new Car(road.getLaneCenter(2), 100, 30, 50, "AI"))
    }

    return cars;
}

//saving the best cars brain neural network
function saveNetwork(){

    //saving the data in the local storage
    localStorgae.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

//removing the best cars brain neural network
function discardNetwork(){
    localStorage.removeItem("bestBrain");
}

//animates the car to allow it to moveby repainting and errasing
function animate(time){

    //the best car that has moved the farthest along the y axis
    bestCar = cars.find(
        c => c.y == Math.min(
            //creating and spreading a new array of the y values of the cars
            ...cars.map(c => c.y)
        )
    );

    //updates the borders for traffic
    for(let i = 0; i < traffic.length; i++) {
        //dont pass traffic as border or collision object as it will detect itself as hit so pass an empty array
        traffic[i].update(road.borders, [])
    }

    //border for the cars, and the traffic that must be avoided too
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }

    //stretching full screen vertically, its in here as it will constantly be called and will be responsive
    carCanvas.height = window.innerHeight;
    neuralNetworkCanvas.height = window.innerHeight;

    //make a camera follow the best car
    carCTX.save();
    carCTX.translate(0, -bestCar.y + carCanvas.height * 0.7)

    //draws the road
    road.draw(carCTX);

    //drawing the traffic cars
    for(let i =0; i < traffic.length; i++) {
        traffic[i].draw(carCTX, "blue");
    }

    //draws the generated AI cars semi transparent
    carCTX.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
       cars[i].draw(carCTX, "green");
    }

    //setting the transperency back to normal for the car in view and making it the only one to have the sensors
    carCTX.globalAlpha = 1;
    bestCar.draw(carCTX, "green", true)

    carCTX.restore();

    //visualising the neural network
    neuralNetworkCTX.lineDashOffset = -time / 50
    networkVisualizer.drawNetwork(neuralNetworkCTX, bestCar.brain);
    requestAnimationFrame(animate);
}



