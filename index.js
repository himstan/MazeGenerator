
let maze = undefined;
let mazeRenderer = undefined;
let mazeSolver = undefined;

const settings = {
    tickSpeed: 0,
    width: 10,
    height: 10,
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
    }
    if (mazeRenderer !== undefined) {
        mazeRenderer.forceStop = true;
    }
    maze = new Maze(settings.width, settings.height);
    switch (settings.solver) {
        case "left-wall":
            mazeSolver = new WallSolver(maze, "left");
        case "right-wall":
            mazeSolver = new WallSolver(maze, "right");
    }
    mazeRenderer = new MazeRenderer(maze, mazeSolver);
    maze.buildMaze((obj) => {
        console.log("built maze in " + obj.elapsedTime + "ms");
        showElement("solverButton");
    });
    mazeRenderer.startRender();
}

function startSolver() {
    if (maze === undefined || !maze.isFinished || mazeSolver.isSolved()) {
        return;
    }
    mazeSolver.solveMaze(() => {
        console.log("solved maze");
    });
}