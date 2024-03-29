class Bishop extends CGFobject {

    /*
    * Consctructor for the bishop game object
    */
    constructor(scene,row,column) {
        super(scene);
        this.deadId = null;
        this.active = true;
        this.scene = scene;
        this.row = row;
        this.column = column;
        this.animation = null;
        this.initComponents();
        this.initTextures();
    }

    initComponents(){

        this.base = new MyCylinder(this.scene, 0.2, 0.7, 0.7, 30, 30);

        this.body = new MyCylinder(this.scene, 1, 0.25, 0.5, 30, 30);

        this.sphere = new MySphere(this.scene, 0.25, 30, 30);

        this.head = new Patch(this.scene, 50, 50, 2, // degree on U: 3 control vertexes U 
            2,  // degree on V: 3 control vertexes on V
            [ // U = 0
                [ // V = 0..1..2
                    [-1.0, 0.0, 0.0,1],
                    [-1.0, 0.0, 0.0,1],
                    [-1.0, 0.0, 0.0,1]
                ],
                // U = 1
                [ // V = 0..1..2
                    [0.0, 0.0, 2.0,1],
                    [0.0, 7.0, 0.0,1],
                    [0.0, 0.0, -2.0,1]
                ],
                // U = 2
                [ // V = 0..1..2
                    [1.0, 0.0, 0.0,1],
                    [1.0, 0.0, 0.0,1],
                    [1.0, 0.0, 0.0,1]
                ]
            ])


    }
    
    initTextures(){
        //wooden appearance
        this.woodenAppearance = new CGFappearance(this.scene);
        this.woodenAppearance.loadTexture("scenes/images/wood.jpg");
		this.woodenAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.woodenAppearance.setAmbient(1,1,1,1);
		this.woodenAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.woodenAppearance.setSpecular(0.5,0.5,0.5,1);
        this.woodenAppearance.setShininess(10.0);

        //glass appearance
        this.glassAppearance = new CGFappearance(this.scene);
        this.glassAppearance.loadTexture("scenes/images/glass.jpg");
		this.glassAppearance.setTextureWrap("CLAMP_TO_EDGE", "CLAMP_TO_EDGE");
    	this.glassAppearance.setAmbient(1,1,1,1);
		this.glassAppearance.setDiffuse(0.5,0.5,0.5,1);
		this.glassAppearance.setSpecular(0.5,0.5,0.5,1);
        this.glassAppearance.setShininess(10.0);
    }

    display(){

        this.scene.pushMatrix();
            this.scene.translate(0,0.235,0);

        //display first base
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.woodenAppearance.apply();
            this.base.display();
        this.scene.popMatrix();

        //display second base
        this.scene.pushMatrix();
            this.scene.translate(0,0.2,0);
            this.scene.scale(0.85,1,0.85);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.woodenAppearance.apply();
            this.base.display();
        this.scene.popMatrix();

        //display third base
        this.scene.pushMatrix();
            this.scene.translate(0,0.4,0);
            this.scene.scale(0.70,1,0.70);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.woodenAppearance.apply();
            this.base.display();
        this.scene.popMatrix();

        //display the lower body of the bishop
        this.scene.pushMatrix();
            this.scene.translate(0,1.7,0);
            this.scene.scale(0.5,1.4,0.5);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.woodenAppearance.apply();
            this.body.display();
        this.scene.popMatrix();

        //display the middle ring part
        this.scene.pushMatrix();
            this.scene.translate(0,1.5,0);
            this.scene.scale(1.4,0.4,1.4);
            this.woodenAppearance.apply();
            this.sphere.display();
            this.scene.translate(0,0.4,0);
            this.scene.scale(0.85,1,0.85);
            this.sphere.display();
            this.scene.translate(0,0.4,0);
            this.scene.scale(0.85,1,0.85);
            this.sphere.display();
        this.scene.popMatrix();

         //display the upper body of the bishop
         this.scene.pushMatrix();
            this.scene.translate(0,1.9,0);
            this.scene.scale(0.3,0.15,0.3);
            this.scene.rotate(Math.PI/2.0,1,0,0);
            this.scene.rotate(Math.PI,1,0,0);
            this.woodenAppearance.apply();
            this.body.display();
         this.scene.popMatrix();

        //display the upper body of the bishop
         this.scene.pushMatrix();
            this.scene.translate(0,2.05,0);
            this.scene.scale(0.158, 0.158, 0.158);
            this.woodenAppearance.apply();
            this.head.display();
         this.scene.popMatrix();

         //display the top sphere of the bishop
         this.scene.pushMatrix();
            this.scene.translate(0,2.35,0);
            this.scene.scale(0.30, 0.20, 0.30);
            this.woodenAppearance.apply();
            this.sphere.display();
         this.scene.popMatrix();
         this.scene.popMatrix();
    }

    move(row,column) {
        this.row = row;
        this.column = column;
    }

    dead(deadId){
        this.deadId = deadId;
        this.active = false;
    }

}