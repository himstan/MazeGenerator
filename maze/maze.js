
class Maze {

    constructor(newWidth, newHeight) {
        this.width = newWidth;
        this.height = newHeight;
        this.tileMap = [this.width];
        this.isFinished = false;
        this.unvisitedTiles = this.width * this.height + 1;
        this.currentTile;
        this.startTile;
        this.finishTile;
        this.forceStop = false;
        this.initMap();
    }

    initMap() {
        for (let i = 0; i < this.width; i++) {
            this.tileMap[i] = [];
            for (let j = 0; j < this.height; j++) {
                // feltölti a mapot üres mezőkkel
                let tile = this.createTile(i,j);
                this.tileMap[i][j] = tile;
            }
        }
    }

    isFinished() {
        return this.isFinished;
    }

    buildMaze(onStart, onEnd) {
        this.isFinished = false;
        this.forceStop = true;
        this.initMap();
        this.startTime = Date.now();
        this.forceStop = false;
        this.buildAldousMaze(onStart, onEnd);
    }

    getAxis() {
        if (parseInt(this.height,10)>parseInt(this.width,10)) {
            return "y";
        } else {
            return "x";
        }
    }

    setCurrentTile(tile) {
        this.currentTile = tile;
    }

    async buildAldousMaze(onStart, onEnd) {
        this.setCurrentTile(this.startTile);
        if (onStart !== undefined) {
            onStart();
        }
        while (this.unvisitedTiles > 0 && !this.forceStop) {
            let currentTile = this.currentTile;
            let nextTileObject = currentTile.pickRandomNeighbour();
            let nextTile = nextTileObject.tile;
            if (!nextTile.isVisited("generator")) {
                this.removeWallsBetweenTiles(currentTile, nextTileObject);
                nextTile.visit("generator");
            }
            this.setCurrentTile(nextTile);
            if (settings.tickSpeed > 0) {
                await sleep(settings.tickSpeed);
            }
        }
        if (onEnd !== undefined) {
            let elapsedTime = (Date.now() - this.startTime);
            onEnd({
                forceStop: this.forceStop,
                elapsedTime: elapsedTime
            });
        }
        this.isFinished = true;
    }

    removeWallsBetweenTiles(currentTile, nextTileObject) {
        let nextWall = nextTileObject.side;
        let currentWall = this.getOppositeSide(nextWall);
        currentTile.walls[nextWall] = false;
        nextTileObject.tile.walls[currentWall] = false;
    }

    createTile(x, y) {
        const tile = new Tile(this, x, y);
        let isStartTile = (x === this.width - 1 && y === this.height - 1);
        let isFinishTile = (x === 0 && y === 0);
        if (isStartTile) tile.markAsStart();
        if (isFinishTile) tile.markAsFinish();
        return tile;
    }

    getOppositeSide(side) {
        switch(side) {
            case "north":
                return "south";
            case "south":
                return "north";
            case "west":
                return "east";
            case "east":
                return "west";
            default:
                return "invalid";
        }
    }

    decrementUnvisitedTiles() {
        this.unvisitedTiles = this.unvisitedTiles - 1;
    }

    incrementUnvisitedTiles() {
        this.unvisitedTiles = this.unvisitedTiles + 1;
    }

    set width(newWidth) {
        this._width = newWidth;
    }

    set height(newHeight) {
        this._height = newHeight;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    set tileMap(tileMap) {
        this._tileMap = tileMap;
    }

    get tileMap() {
        return this._tileMap;
    }

    set finishTile(finishTile) {
        this._finishTile = finishTile;
    }

    get finishTile() {
        return this._finishTile;
    }

    set startTile(startTile) {
        this._startTile = startTile;
    }

    get startTile() {
        return this._startTile;
    }
}






