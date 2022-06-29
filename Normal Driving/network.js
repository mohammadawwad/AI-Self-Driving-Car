class NeuralNetwork {
    //number of neurons in each layer
    constructor(neuronCounts){
        this.levels = [];

        //specifying the input and output count
        for(let i = 0; i < neuronCounts.length - 1; i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i + 1]
            ));
        }
    }

    static feedForward(givenInputs, network){
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        
        //setting the output of the previous level to be the input of the next level
        for(let i = 1; i < network.levels.length; i++){
            outputs = Level.feedForward(outputs, network.levels[i]);
        }

        //final output lets us know whether the car needs to go forward, backward, left, or right
        return outputs;
    }
}




class Level {
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);

        // a value above which it will fire
        this.biases = new Array(outputCount);

        //connecting every input neuron to every output
        this.weights = [];
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){

        //
        for(let i = 0; i < level.inputs.length; i++){
            for(let j = 0; j < level.outputs.length; j++){
                level.weights[i][j] = Math.random() * 2 - 1
            }
        }

        //
        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random() * 2 -1
        }
    }

    static feedForward(givenInputs, level){

        //
        for(let i = 0; i < level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }

        //
        for(let i = 0; i <level.outputs.length; i++){
            let sum = 0;

            for(let j = 0; j < level.inputs.length; j++){
                sum += level.inputs[j] * level.weights[j][i];
            }

            if(sum > level.biases[i]){
                //setting the output nueron to be on
                level.outputs[i] = 1;
            } else {
                //setting the output nueron to be off
                level.outputs[i] = 0;
            }
        }
        
        //returning the outputs
        return level.outputs;

    }
}