class Controls {

    constructor(type){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        //decides what kind of controls the cars will have
        switch(type) {
            case "KEYS":
                //private keyboard listner for the car we want to control
                this.#addKeyboardListener();
                break;

            case "TRAFFIC":
            default:
                this.forward = true;
                break;
        }
    }

    #addKeyboardListener(){

        //event listener to check if a key is pressed, if it is then it will be true
        document.onkeydown = (event) => {
            switch(event.key){
                case "ArrowLeft": 
                    this.left = true;
                    break;

                case "ArrowRight": 
                    this.right = true;
                    break;

                case "ArrowUp": 
                    this.forward = true;
                    break;

                case "ArrowDown": 
                    this.reverse = true;
                    break;
            }

            //logging the object
            // console.table(this);
        }

        //event listener to check if a key is released, if it is then it will be set back to false
        document.onkeyup = (event) => {
            switch(event.key) {
                case "ArrowLeft": 
                    this.left = false;
                    break;

                case "ArrowRight": 
                    this.right = false;
                    break;

                case "ArrowUp": 
                    this.forward = false;
                    break;

                case "ArrowDown": 
                    this.reverse = false;
                    break;
            }
            
            //logging the object
            // console.table(this);
        }
    }
}