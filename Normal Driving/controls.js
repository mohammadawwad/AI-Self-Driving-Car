class Controls {

    constructor(){
        this.forward = false;
        this.left = false;
        this.right = false;
        this.reverse = false;

        //private keyboard listner
        this.#addKeyboardListener();
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