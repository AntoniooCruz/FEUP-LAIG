class Clock extends CGFobject {

    /*
    * Constructor for the clock game object
    */
    constructor(scene, numbers, timePerPlay) {
        super(scene);
        this.scene = scene;

        this.originalTime = timePerPlay;
        this.seconds = timePerPlay;
        this.pause = false;
        this.numbers = numbers;

        this.initComponents();
        this.initTextures();

        this.updateSecondsText();

    }

    initComponents(){

        this.plane = new Plane(this.scene, 1, 1);
    }
    
    initTextures(){
        //wooden appearance
        this.clockAppearance = new CGFappearance(this.scene);
        this.clockAppearance.loadTexture("scenes/images//numbers/2.jpg");
		this.clockAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.clockAppearance.setAmbient(1,1,1,1);
		this.clockAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.clockAppearance.setSpecular(0.5,0.5,0.5,1);
        this.clockAppearance.setShininess(10.0);
    }
    /**
     * Resets the clock after a play or the time as passed
     */
    reset() {
        this.seconds = this.originalTime;
    }
    /**
     * Responsible for ticking down the time every second
     */
    decTime(){
        if(!this.pause){
            if(this.seconds == 0){
                this.reset();
                return true;
            } else {
                this.seconds--;
                this.updateSecondsText();
                return false;
            }
        }
    }
    /**
     * Updates the second texture based on the number of seconds left on the play clock
     */
    updateSecondsText(){

        this.secondsNum1 = Math.floor(this.seconds / 10);
        this.secondsNum2 = this.seconds % 10;

        this.secondsTex1 = this.numbers[this.secondsNum1];
        this.secondsTex2 = this.numbers[this.secondsNum2];

    }
    /**
     * Display function
     */
    display(){
        //First digit of the clock
        this.scene.pushMatrix();
            if(this.secondsTex1 != null)
            this.secondsTex1.apply();
            this.scene.translate(0,0,0);
            this.plane.display();
        this.scene.popMatrix();
        // second digit of the clock
        this.scene.pushMatrix();
        if(this.secondsTex2 != null)
            this.secondsTex2.apply();
            this.scene.translate(-1,0,0);
            this.plane.display();
        this.scene.popMatrix();
    }
}