class WallSolver extends MazeSolver {

    constructor(maze) {
        super(maze);
        this._directions = {
            left: {
                north: "west",
                west: "south",
                south: "east",
                east: "north"
            },
            right: {
                north: "east",
                east: "south",
                south: "west",
                west: "north"
            }
        }
        this._facing = "north";
        this._wallSide = "left";
    }

    async _solveMaze(callback, onDone) {
        this.setCurrentTile(this.getStarterTile());
        let finishTile = this.getFinishTile();
        while(this.getCurrentTile() !== finishTile || !this.isSolving) {
            // if can turn left, turns left and takes a step in that direction
            if (this.canTurnDirection("left")) {
                this.turn("left");
                this.moveToTile(this.getFacing());
            } else {
                // if can't go forward then turn right, else go forward
                if (!this.canMoveToTile(this.getFacing())) {
                    this.turn("right");
                } else {
                    this.moveToTile(this.getFacing());
                }
            }
            if (settings.tickSpeed > 0) {
                await sleep(settings.tickSpeed);
            }
        }
        this.setSolving(false);
        callback();
        onDone();
    }

    _stopSolving() {
        this._setSolving(false);
    }

    turn(turnDirection) {
        this.setFacing(this.getTurnDirection(turnDirection));
    }

    getOppositeWallSide() {
        if (this._wallSide == "left") {
            return "right";
        } else {
            return "left";
        }
    }

    canTurnDirection(turnDirection) {
        let currentTile = this.getCurrentTile();
        let walls = currentTile.walls;
        let direction = this.getTurnDirection(turnDirection);
        // returns true if there isnt a wall in that direction
        return !walls[direction];
    }

    getTurnDirection(turnDirection) {
        return this._directions[turnDirection][this.getFacing()];
    }

    getWallSide() {
        return this._wallSide;
    }

    getFacing() {
        return this._facing;
    }

    setFacing(direction) {
        this._facing = direction;
    }
}