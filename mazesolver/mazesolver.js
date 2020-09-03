class MazeSolver {

    constructor(maze) {
        this._maze = maze;
        this._path = [];
        this._currentTile;
        this._isSolving = false;
        this._isSolved = false;
    }

    _stopSolving() {

    }

    _solveMaze() {
        console.log("mazesolver");
    }

    isSolving() {
        return this._isSolving;
    }

    setSolving(solving) {
        this._isSolving = solving;
    }

    setCurrentTile(nextTile) {
        if (nextTile.isVisited("solver")) {
            this._path.pop();
        } else {
            nextTile.visit("solver");
            this._path.push(nextTile);
        }
        this._currentTile = nextTile;
    }

    solveMaze(onDone) {
        // handle stopping the algorithm before starting a new one
        if (this.isSolving()) {
            this._stopSolving();
        }
        this.setSolved(false);
        this.clearSolvePath();
        this.setSolving(true);
        this._solveMaze(onDone, () => {
            this.setSolved(true);
        });
    }

    setSolved(solved) {
        this._isSolved = solved;
    }

    isSolved() {
        return this._isSolved;
    }

    clearSolvePath() {
        this._path = [];
    }

    getSolvePath() {
        return this._path;
    }

    getCurrentTile() {
        return this._currentTile;
    }

    getStarterTile() {
        return this._maze.startTile;
    }

    getFinishTile() {
        return this._maze.finishTile;
    }

    moveToTile(direction) {
        const currentTile = this.getCurrentTile();
        const maze = this._maze;
        const tileMap = maze.tileMap;
        const currentX = currentTile.x;
        const currentY = currentTile.y;
        let potentialTile;

        switch (direction) {
            case "north":
                potentialTile = tileMap[currentX][currentY - 1];
                break;
            case "south":
                potentialTile = tileMap[currentX][currentY + 1];
                break;
            case "east":
                potentialTile = tileMap[currentX + 1][currentY];
                break;
            case "west":
                potentialTile = tileMap[currentX - 1][currentY];
                break;
        }

        if (potentialTile !== undefined) {
            this.setCurrentTile(potentialTile);
        }
    }

    canMoveToTile(direction) {
        const currentTile = this.getCurrentTile();
        const mazeHeight = this._maze.height;
        const mazeWidth = this._maze.width;
        const currentX = currentTile.x;
        const currentY = currentTile.y;

        if (currentTile.hasWall(direction)) {
            return false;
        }

        switch(direction) {
            case "north":
                return currentY > 0;
            case "south":
                return currentY < mazeHeight;
            case "east":
                return currentX > 0;
            case "west":
                return currentX < mazeWidth;
            default:
                return false;
        }
    }

}