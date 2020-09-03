class Tile {
    constructor(maze, x,y) {
        this.maze = maze;
        this.x = x;
        this.y = y;
        this._isVisited = {
            generator: false,
            solver: false
        };
        this.isStart = false;
        this.isFinish = false;
        this.walls = {
            north: true,
            east: true,
            south: true,
            west: true
        }
    }

    hasWall(direction) {
        return this.walls[direction];
    }

    pickRandomNeighbour() {
        let potentialNeighbours = this.getPotentialNeighbours();
        let randomNumber = Math.floor(Math.random() * (potentialNeighbours.length));
        return potentialNeighbours[randomNumber];
    }

    getPotentialNeighbours() {
        let potentialNeighbours = [];
        let mazeWidth = this.maze.width - 1;
        let mazeHeight = this.maze.height - 1;
        // check left neighbour
        if (this.x > 0) {
            potentialNeighbours.push({tile: this.maze.tileMap[this.x - 1][this.y], side: "west"});
        }
        // check right neighbour
        if (this.x < mazeWidth) {
            potentialNeighbours.push({tile: this.maze.tileMap[this.x + 1][this.y], side: "east"});
        }
        // check northern neighbour
        if (this.y > 0) {
            potentialNeighbours.push({tile: this.maze.tileMap[this.x][this.y - 1], side: "north"});
        }
        // check southern neighbour
        if (this.y < mazeHeight) {
            potentialNeighbours.push({tile: this.maze.tileMap[this.x][this.y + 1], side: "south"});
        }
        return potentialNeighbours;
    }

    markAsFinish() {
        if (this.x === 0 && this.y === 0) {
            this.isFinish = true;
            this.walls.north = false;
            this.maze.finishTile = this;
        }
    }

    markAsStart() {
        if (this.x === this.maze.width - 1 && this.y === this.maze.height - 1) {
            this.isStart = true;
            this.walls.south = false;
            this.maze.startTile = this;
            this.visit("generator");
        }
    }

    isVisited(visitor) {
        return this._isVisited[visitor];
    }

    visit(visitor) {
        this._isVisited[visitor] = true;
        if (visitor === "generator") {
            this.maze.decrementUnvisitedTiles();
        }
    }

    unvisit(visitor) {
        this._isVisited[visitor] = false;
        if (visitor === "generator") {
            this.maze.incrementUnvisitedTiles();
        }
    }

    set maze(maze) {
        this._maze = maze;
    }

    get maze() {
        return this._maze;
    }

    set walls(value) {
        this._walls = value
    }

    get walls() {
        return this._walls;
    }

    set x(x) {
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set y(y) {
        this._y = y;
    }

    get y() {
        return this._y;
    }
}