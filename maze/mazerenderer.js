class MazeRenderer {
    constructor(maze, mazeSolver) {
        this.canvas = document.getElementById("maze");
        this.ctx = this.canvas.getContext("2d");
        this.setMaze(maze);
        this.setMazeSolver(mazeSolver);
        this.tileSize;
        this.forceStop = false;
        this._isRendering = false;
    }

    setMazeSolver(mazeSolver) {
        this._mazeSolver = mazeSolver;
    }

    setMaze(maze) {
        this.maze = maze;
        if (maze !== undefined) {
            this.tileSize = this._getTileSize();
        }
    }

    _getTileSize() {
        let axis = this.maze.getAxis();
        if (axis == 'y') {
            return (this.canvas.height) / (this.maze.height);
        } else {
            return (this.canvas.width) / (this.maze.width);
        }
    }

    startRender(onRenderStop) {
        if (this.isRendering()) {
            this.stopRendering();
        }
        this.forceStop = false;
        this.renderMaze(onRenderStop);
    }

    stopRendering() {
        this.forceStop = true;
    }

    isRendering() {
        return this._isRendering;
    }

    renderIterator(tile, color = "red") {
        const tileX = tile.x;
        const tileY = tile.y;
        const tileSize = this.tileSize;
        const ctx = this.ctx;
        ctx.fillStyle = color;
        ctx.fillRect(tileX * tileSize + (tileSize / 4), tileY * tileSize + (tileSize / 4), tileSize/2, tileSize/2);
    }

    drawMaze() {
        let maze = this.maze;
        if (maze !== undefined) {
            for (let i = 0; i < maze.width; i++) {
                for (let j = 0; j < maze.height; j++) {
                    let tile = maze.tileMap[i][j];
                    let color;
                    if (tile.isVisited) {
                        color = "black";
                    } else {
                        this.renderIterator(tile, "green");
                        color = "black";
                    }

                    this.drawWalls(tile, color, false);
                }
            }
            if (!maze.isFinished) {
                this.renderIterator(maze.currentTile);
            }
            if (maze.finishTile !== undefined) {
                this.drawWall(maze.finishTile, "north", "yellow", 10);
            }
            if (maze.startTile !== undefined) {
                this.drawWall(maze.startTile, "south", "green", 10);
            }
        }
    }

    drawSolver() {
        let mazeSolver = this._mazeSolver;
        let color = "blue";
        if (mazeSolver !== undefined) {
            let drawnTile = [];
            let solvePath = mazeSolver.getSolvePath();
            if (solvePath === undefined || solvePath.length < 1) return;
            for (let i = 0; i < solvePath.length; i++) {
                let tile = solvePath[i];
                if (drawnTile.includes(tile)) {
                    continue;
                }
                if (mazeSolver.isSolved()) {
                    color = "green";
                }
                this.renderIterator(tile, color);
                drawnTile.push(tile);
            }
        }
    }

    async renderMaze(onRenderStop) {
        this.forceStop = false;
        while (!((maze == undefined || maze.isFinished) && (mazeSolver == undefined || mazeSolver.isSolved()))) {
            this.clearCanvas();
            if (this.forceStop) {
                return;
            }
            this.draw();
            await sleep(settings.tickSpeed);
        }
        this.clearCanvas();
        this.draw();
        if (onRenderStop !== undefined) {
            onRenderStop();
        }
    }

    draw() {
        this.drawMaze();
        this.drawSolver();
    }

    clearCanvas() {
        this.ctx.beginPath();
        this.ctx.fillStyle = "gray";
        this.ctx.moveTo(0,0);
        this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.stroke();
    }

    drawRect(tile) {
        const x = tile.x;
        const y = tile.y;
        const tileSize = this.tileSize;
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.fillStyle = "red";
        this.ctx.drawLine(x * tileSize, y * tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize);
        this.ctx.stroke();
    }

    drawWalls(tile, color, forceDraw) {
        const x = tile.x;
        const y = tile.y;
        const tileSize = this.tileSize;
        if (tile.walls.north || forceDraw) {
            this.drawLine(x * tileSize, y * tileSize, (x * tileSize) + tileSize, y * tileSize, color);
        }
        if (tile.walls.east || forceDraw) {
            this.drawLine((x * tileSize) + tileSize, y * tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color);
        }
        if (tile.walls.south || forceDraw) {
            this.drawLine(x * tileSize, (y * tileSize) + tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color);
        }
        if (tile.walls.west || forceDraw) {
            this.drawLine(x * tileSize, y * tileSize, x * tileSize, (y * tileSize) + tileSize, color);
        }
    }

    drawWall(tile, side, color, width) {
        const x = tile.x + this.offsetX;
        const y = tile.y + this.offsetY;
        const tileSize = this.tileSize;
        switch (side) {
            case "north":
                this.drawLine(x * tileSize * 0, y * tileSize, (x * tileSize) + tileSize, y * tileSize, color, width);
                break;
            case "east":
                this.drawLine((x * tileSize) + tileSize, y * tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color, width);
                break;
            case "south":
                this.drawLine(x * tileSize, (y * tileSize) + tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color, width);
                break;
            case "west":
                this.drawLine(x * tileSize, y * tileSize, x * tileSize, (y * tileSize) + tileSize, color, width);
                break;
        }
    }

    clearWall(tile, side) {
        const x = tile.x + this.offsetX;
        const y = tile.y + this.offsetY;
        const tileSize = this.tileSize;
        const color = "grey";
        switch(side) {
            case "north":
                this.drawLine(x * tileSize, y * tileSize, (x * tileSize) + tileSize, y * tileSize, color);
                break;
            case "east":
                this.drawLine((x * tileSize) + tileSize, y * tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color);
                break;
            case "south":
                this.drawLine(x * tileSize, (y * tileSize) + tileSize, (x * tileSize) + tileSize, (y * tileSize) + tileSize, color);
                break;
            case "west":
                this.drawLine(x * tileSize, y * tileSize, x * tileSize, (y * tileSize) + tileSize, color);
                break;
            default:
                return "invalid";
        }
    }

    clearWalls(tile) {
        this.drawWalls(tile, "grey", true);
    }

    drawLine(x1, y1, x2, y2, color, width = 2) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2,y2);
        this.ctx.stroke();
    }
    
}