class MadBishops extends CGFobject {

	constructor(scene,player1,player2){
        super(scene);
        this.scene = scene;

        this.activeBishop = null;
        this.pause = false;
        this.board = new Board(scene);
        this.player1 = player1;
        this.player2 = player2;
        this.boardState = null;
        this.previousBoardState = null;
        this.previousBishops = [];
        this.gameMoves = [];
        this.whitePieces = 25;
        this.blackPieces = 25;
        this.playerTurn = 2;

        makeRequest("initial_state", data => this.initializeBoard(data));
    }

    undoMove(){
        if(this.boardState != this.previousBoardState && this.previousBoardState != null){
            this.boardState = this.previousBoardState;
            console.log('prev',this.previousBishops);
            for(let i = 0; i < this.previousBishops.length; i++){
                this.previousBishops[i].animation.done = false;
                this.previousBishops[i].animation.reverse = true;
            }
            this.playerTurn = (this.playerTurn % 2) + 1;
            this.scene.rotateCamera();
            console.log('Undoing Move',this.previousBoardState,this.boardState);
            console.log(this.gameMoves,'Now moves');
        }
    }

    checkValidPlay(startRow,startColumn,endRow,endColumn){
        validPlay(this.boardState, this.playerTurn, startColumn,startRow,endColumn, endRow, data => this.validPlayHandler(data,startRow,startColumn,endRow,endColumn));
    }
        
    initializeBoard(data) {
        
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        this.playerTurn = JSON.parse(data.target.response)[3];

        console.log(this.boardState);

    }

    isGameOver(data){
        let gameOver = JSON.parse(data.target.response);
        if(gameOver == 1)
            console.log('Player 1 WONNERED ! :)');
        else if(gameOver == 2)
            console.log('Player 2 WONNERED ! :)');
    }

    aiEasyPickHandler(data) {
        this.aiEasyMoveFromX = Number(JSON.parse(data.target.response)[0]);
        this.aiEasyMoveFromY = Number(JSON.parse(data.target.response)[1]);
        this.aiEasyMoveToX = Number(JSON.parse(data.target.response)[2]);
        this.aiEasyMoveToY = Number(JSON.parse(data.target.response)[3]);

        this.board.makeMove(this.aiEasyMoveFromX,this.aiEasyMoveFromY,this.aiEasyMoveToX,this.aiEasyMoveToY);
        this.gameMoves.push([this.aiEasyMoveFromX,this.aiEasyMoveFromY,this.aiEasyMoveToX,this.aiEasyMoveToY]);
        serverMove(this.aiEasyMoveFromX,this.aiEasyMoveFromY,this.aiEasyMoveToX,this.aiEasyMoveToY,this.boardState,this.whitePieces,this.blackPieces,this.playerTurn, data2 => this.serverMoveHandler(data2));
    }

    aiMediumPickHandler(data) {
        this.aiMediumMoveFromX = Number(data.target.response[5]);
        this.aiMediumMoveFromY = Number(data.target.response[7]);
        this.aiMediumMoveToX = Number(data.target.response[9]);
        this.aiMediumMoveToY = Number(data.target.response[11]);

        this.board.makeMove(this.aiMediumMoveFromX,this.aiMediumMoveFromY,this.aiMediumMoveToX,this.aiMediumMoveToY);
        this.gameMoves.push([this.aiMediumMoveFromX,this.aiMediumMoveFromY,this.aiMediumMoveToX,this.aiMediumMoveToY]);
        serverMove(this.aiMediumMoveFromX,this.aiMediumMoveFromY,this.aiMediumMoveToX,this.aiMediumMoveToY,this.boardState,this.whitePieces,this.blackPieces,this.playerTurn, data2 => this.serverMoveHandler(data2));
    }

    validPlayHandler(data,startRow,startColumn,endRow,endColumn){

        this.valid = JSON.parse(data.target.response);
        if(this.valid == 1){
            this.board.makeMove(startRow,startColumn,endRow,endColumn);
            this.playerTurn = (this.playerTurn % 2) + 1;
            serverMove(startColumn,startRow,endColumn,endRow,this.boardState,this.whitePieces,this.blackPieces,this.playerTurn, data2 => this.serverMoveHandler(data2));
            this.gameMoves.push([startRow,startColumn,endRow,endColumn]);
            this.activeBishop = null;
            console.log('Moves',this.gameMoves);
            gameOver(this.boardState,this.whitePieces,this.blackPieces, data3 => this.isGameOver(data3));
            this.board.counter.updateNumberPieces();
        } else 
            console.log('Invalid Move',startColumn,startRow,endColumn,endRow);
    }

    serverMoveHandler(data) {
    	this.previousBoardState = this.boardState;
        this.boardState = JSON.parse(data.target.response)[0];
        this.whitePieces = JSON.parse(data.target.response)[1];
        this.blackPieces = JSON.parse(data.target.response)[2];
        console.log(this.boardState,this.whitePieces,this.blackPieces)
    }
    
    handleClickBoard(obj,customId) {
        console.log('p',this.playerTurn,this.player1,this.player2)
        if((this.playerTurn == 1 && this.player1 == 'Human') || (this.playerTurn == 2 && this.player2 == 'Human')){
        if(obj instanceof Bishop) {
            if((this.activeBishop == null && obj instanceof WhiteBishop && this.playerTurn == 1)
                || (this.activeBishop == null && obj instanceof BlackBishop && this.playerTurn == 2)){
                this.activeBishop = obj;
            } else if(this.activeBishop == obj){
                this.activeBishop = null;
                console.log('thesame');
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof WhiteBishop){
                this.activeBishop = obj;
            } else if(this.activeBishop instanceof WhiteBishop && obj instanceof BlackBishop) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
                let bishops = [];
                bishops.push(this.activeBishop);
                bishops.push(obj);
                this.previousBishops = bishops;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof BlackBishop){
                this.activeBishop = obj;
            } else if (this.activeBishop instanceof BlackBishop && obj instanceof WhiteBishop){
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,obj.row,obj.column);
                let bishops = [];
                bishops.push(this.activeBishop);
                bishops.push(obj);
                this.previousBishops = bishops;
                console.log(bishops,this.previousBishops);
            }
        } else if (obj instanceof Plane) {
            let endRow = Math.floor(customId / 10);
            let endColumn = customId % 10;
            if(this.activeBishop != null) {
                this.checkValidPlay(this.activeBishop.row,this.activeBishop.column,endRow,endColumn);
                let bishops = [];
                bishops.push(this.activeBishop);
                this.previousBishops = bishops;
            }
        }

        console.log(this.activeBishop);
    } else  {
        if(this.playerTurn == 1){
            switch(this.player1){
                case 'Random':
                    aiMedium(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                case 'Smart':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                default:
                break;
            }
        } else if(this.playerTurn == 2){
            switch(this.player2){
                case 'Random':
                    aiMedium(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                case 'Smart':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                default:
                break;
            }
        }
        this.playerTurn = (this.playerTurn % 2) + 1;
        this.activeBishop = null;
        gameOver(this.boardState,this.whitePieces,this.blackPieces, data3 => this.isGameOver(data3));
        this.board.counter.updateNumberPieces();

    } 
    }

    /*handleAI(){
        if(this.playerTurn == 1){
            switch(this.player1){
                case 'Random':
                    aiMedium(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                case 'Smart':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                default:
                return;
            }
        } else if(this.playerTurn == 2){
            switch(this.player2){
                case 'Random':
                    aiMedium(this.boardState, this.playerTurn, data5 => this.aiEasyPickHandler(data5));
                case 'Smart':
                    aiMedium(this.boardState, this.playerTurn, this.whitePieces, this.blackPieces, data4 => this.aiMediumPickHandler(data4));
                default:
                return;
            }
        }
        this.playerTurn = (this.playerTurn % 2) + 1;
        this.activeBishop = null;
        gameOver(this.boardState,this.whitePieces,this.blackPieces, data3 => this.isGameOver(data3));
        this.board.counter.updateNumberPieces();
    }*/

    update(deltaTime){
        this.board.update(deltaTime);
        for(let i = 0; i < this.board.whiteBishops.length; i++){
            if(this.activeBishop == this.board.whiteBishops[i]){
                this.board.whiteBishops[i].selected = true;
            } else {
                this.board.whiteBishops[i].selected = false;
            }
            this.board.whiteBishops[i].isSelected();
            if(this.board.whiteBishops[i].animation != null && this.board.whiteBishops[i].animation.reverseDone){
                this.handleUndo();
            }
        }
        for(let i = 0; i < this.board.blackBishops.length; i++){
            if(this.activeBishop == this.board.blackBishops[i]){
                this.board.blackBishops[i].selected = true;
            } else {
                this.board.blackBishops[i].selected = false;
                }
            this.board.blackBishops[i].isSelected();
            if(this.board.blackBishops[i].animation != null && this.board.blackBishops[i].animation.reverseDone){
                this.handleUndo();
            }
            }
            

        }

    handleUndo(){
        let undoneMove = this.gameMoves.pop();
        this.previousBishops[0].row = undoneMove[0];
        this.previousBishops[0].column = undoneMove[1];
        for(let i = 0; i < this.previousBishops.length; i++){
            this.previousBishops[i].animation = null;
            if(i == 1)
                this.board.reactivate(this.previousBishops[i]);
        }

    }

	display() {
		this.board.display();
	}
}