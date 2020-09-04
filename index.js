
let maze = undefined;
let mazeSolver = undefined;
let mazeRenderer = undefined;

const settings = {
    tickSpeed: 500,
    width: 15,
    height: 15,
    generator: 'aldeous',
    solver: 'left-wall'
}

function updateValue(valueName, event, min, max) {
    let newValue = event.target.value;
    if (min !== undefined && newValue < min) {
        newValue = min;
    }
    if (max !== undefined && newValue > max) {
        newValue = max;
    }
    for (element of document.getElementsByClassName(valueName)) {
        element.value = newValue;
    }
    settings[valueName] = newValue;
}

function hideElement(elementID) {
    document.getElementById(elementID).classList.add("hidden");
}

function showElement(elementID) {
    document.getElementById(elementID).classList.remove("hidden");
}

function startMaze() {
    hideElement("solverButton");
    if (maze !== undefined) {
        maze.forceStop = true;
        maze = undefined;
    }
    let mazeWidth = settings.width;
    let mazeHeight = settings.height;
    maze = new Maze(mazeWidth, mazeHeight);
    switch (settings.solver) {
        case "left-wall":
            mazeSolver = new WallSolver(maze, "left");
        case "right-wall":
            mazeSolver = new WallSolver(maze, "right");
    }
    if (mazeRenderer !== undefined) {
        mazeRenderer.stopRendering();
        mazeRenderer.setMaze(maze);
        mazeRenderer.setMazeSolver(mazeSolver);
    } else {
        mazeRenderer = new MazeRenderer(maze, mazeSolver);
    }
    maze.buildMaze(() => {
        console.log("started building maze");
    },
    (obj) => {
        if (!obj.forceStop) {
            console.log("built maze in " + obj.elapsedTime + "ms");
            showElement("solverButton");
        } else {
            console.log("maze terminated");
        }
    });
    mazeRenderer.renderMaze();
}

function startSolver() {
    if (maze === undefined || !maze.isFinished || mazeSolver.isSolved()) {
        return;
    }
    mazeSolver.solveMaze(() => {
        console.log("maze solved");
    });
}
