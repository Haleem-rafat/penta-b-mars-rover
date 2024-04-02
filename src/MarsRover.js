import React, { useState } from "react";

const MarsRover = () => {
  const [roverPosition, setRoverPosition] = useState({
    x: 0,
    y: 0,
    direction: "NORTH",
  });
  const [commands, setCommands] = useState("");
  const [moveHistory, setMoveHistory] = useState([]);
  const [obstacles, setObstacles] = useState([[1, 4], [3, 5], [7, 4]]); 
  const [errorMessage, setErrorMessage] = useState("");  
  const validCommands = new Set(["F", "B", "L", "R"]); 

  const moveRover = (commands) => {
    const newPosition = { ...roverPosition };
    const newMoveHistory = [...moveHistory];
    let errorEncountered = false; 

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].toUpperCase(); 
      
      if (!validCommands.has(command)) {
        continue; // 
      }

      switch (command) {
        case "F":
          moveForward(newPosition);
          break;
        case "B":
          moveBackward(newPosition);
          break;
        case "L":
          rotateLeft(newPosition);
          break;
        case "R":
          rotateRight(newPosition);
          break;
        default:
          break;
      }

      if (isObstacle(newPosition)) {
        setErrorMessage("Error: Rover cannot move onto an obstacle!");
        errorEncountered = true;
        break;
      }

      newMoveHistory.push({ ...newPosition });
    }

    if (!errorEncountered) {
      setRoverPosition(newPosition);
      setMoveHistory(newMoveHistory);
      setErrorMessage(""); // Reset error message if no error encountered
    }
  };

  const moveForward = (position) => {
    switch (position.direction) {
      case "NORTH":
        position.y++;
        break;
      case "EAST":
        position.x++;
        break;
      case "SOUTH":
        position.y--;
        break;
      case "WEST":
        position.x--;
        break;
      default:
        break;
    }
  };

  const moveBackward = (position) => {
    switch (position.direction) {
      case "NORTH":
        position.y--;
        break;
      case "EAST":
        position.x--;
        break;
      case "SOUTH":
        position.y++;
        break;
      case "WEST":
        position.x++;
        break;
      default:
        break;
    }
  };

  const rotateLeft = (position) => {
    switch (position.direction) {
      case "NORTH":
        position.direction = "WEST";
        break;
      case "EAST":
        position.direction = "NORTH";
        break;
      case "SOUTH":
        position.direction = "EAST";
        break;
      case "WEST":
        position.direction = "SOUTH";
        break;
      default:
        break;
    }
  };

  const rotateRight = (position) => {
    switch (position.direction) {
      case "NORTH":
        position.direction = "EAST";
        break;
      case "EAST":
        position.direction = "SOUTH";
        break;
      case "SOUTH":
        position.direction = "WEST";
        break;
      case "WEST":
        position.direction = "NORTH";
        break;
      default:
        break;
    }
  };

   const isObstacle = (position) => {
    return obstacles.some(obstacle => obstacle[0] === position.x && obstacle[1] === position.y);
  };

  const handleChange = (e) => {
    setCommands(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    moveRover(commands);
    setCommands("");
  };

  const handleObstacleChange = (e, index, coordIndex) => {
    const newObstacles = [...obstacles];
    const [x, y] = newObstacles[index];
    const value = parseInt(e.target.value);
    newObstacles[index] = isNaN(value) ? [x, y] : coordIndex === 0 ? [value, y] : [x, value];
    setObstacles(newObstacles);
  };

  const handleAddObstacle = () => {
    setObstacles([...obstacles, [0, 0]]); 
  };

  const handleRemoveObstacle = (index) => {
    setObstacles(obstacles.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4 flex gap-10">
      <div>
        <h1 className="text-2xl font-bold mb-4">Mars Rover</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={commands}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 mr-2"
            placeholder="Enter commands..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Move Rover
          </button>
        </form>
          {errorMessage && (
          <div className="text-red-500 text-sm font-semibold my-2">
            {errorMessage}
          </div>
        )}
        <div className="text-gray-500 text-sm pt-4 flex flex-col gap-2">
          <li>F = Move forward on current heading </li>
          <li>B = Move backwards on current heading</li>
          <li>L = Rotate left by 90 degrees</li>
          <li>R = Rotate right by 90 degrees</li>
        </div>
      </div>
      <div className="mt-4 flex gap-10">
        <div>
          <h2 className="text-lg font-semibold mb-2">Current Position:</h2>
          <ul>
            <p className="py-2">{`(${roverPosition.x}, ${roverPosition.y}) ${roverPosition.direction}`}</p>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Move History:</h2>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>{`(${move.x}, ${move.y}) ${move.direction}`}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
      
        <h2 className="text-lg font-semibold mb-2">Obstacles:</h2>
        <div className="flex flex-col  gap-2">
        {obstacles.map((obstacle, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="number"
              value={obstacle[0]}
              onChange={(e) => handleObstacleChange(e, index, 0)}
              className="border border-gray-300 rounded-md p-2 mr-2"
              placeholder="X coordinate"
            />
            <input
              type="number"
              value={obstacle[1]}
              onChange={(e) => handleObstacleChange(e, index, 1)}
              className="border border-gray-300 rounded-md p-2 mr-2"
              placeholder="Y coordinate"
            />
            <button
              type="button"
              onClick={() => handleRemoveObstacle(index)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Remove
            </button>
          </div>
        ))}
        </div>
        <button
          type="button"
          onClick={handleAddObstacle}
          className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
        >
          Add Obstacle
        </button>
      </div>
    </div>
  );
};

export default MarsRover;
