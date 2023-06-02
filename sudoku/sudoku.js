// SUDOKU SOLVER JS CODE

function generateBoard() {
  var board = [];

  // Generate an empty 9x9 Sudoku board
  for (var i = 0; i < 9; i++) {
    var row = [];
    for (var j = 0; j < 9; j++) {
      row.push(null);
    }
    board.push(row);
  }

  // Add a small portion of the board with random numbers
  var filledCells = 0;
  var maxFilledCells = Math.floor((9 * 9) / 5);

  while (filledCells < maxFilledCells) {
    var randomRow = Math.floor(Math.random() * 9);
    var randomCol = Math.floor(Math.random() * 9);
    var randomNumber = Math.floor(Math.random() * 9) + 1;

    // Check if the cell is already filled
    if (board[randomRow][randomCol] === null) {
        // Check if the number is valid in the row, column, and section
        var isValid = true;
  
        // Check row and column
        for (var i = 0; i < 9; i++) {
          if (
            board[randomRow][i] === randomNumber ||
            board[i][randomCol] === randomNumber
          ) {
            isValid = false;
            break;
          }
        }
  
        // Check section
        var sectionStartRow = Math.floor(randomRow / 3) * 3;
        var sectionStartCol = Math.floor(randomCol / 3) * 3;
  
        for (var i = sectionStartRow; i < sectionStartRow + 3; i++) {
          for (var j = sectionStartCol; j < sectionStartCol + 3; j++) {
            if (board[i][j] === randomNumber) {
              isValid = false;
              break;
            }
          }
        }
        
        // Check overall board
        const solvable = validBoard(board);
        if (isValid && solvable) {
          board[randomRow][randomCol] = randomNumber;
          filledCells++;
        }
      }
    }

  // Clear all input fields
  var inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(function (input) {
    input.value = "";
  });

  // Populate input fields with the generated Sudoku board
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      var cellId = i * 9 + j + 1;
      var cellValue = board[i][j];
      if (cellValue !== null) {
        var cell = document.getElementById(cellId.toString());
        cell.value = cellValue;
      }
    }
  }
}

function initiate() {
  // Grabs data from textboxes
  var startingBoard = [[]];
  var j = 0;
  for (var i = 1; i <= 81; i++) {
    const val = document.getElementById(String(i)).value;
    if (val == "") {
      startingBoard[j].push(null);
    } else {
      startingBoard[j].push(Number(val));
    }
    if (i % 9 == 0 && i < 81) {
      startingBoard.push([]);
      j++;
    }
  }
  // Once all data is collected, check if the starting board is valid
  const inputValid = validBoard(startingBoard);
  if (inputValid) {
    const answer = solve(startingBoard);
    updateBoard(answer);
  } else {
    console.log("Invalid input board");
  }
}

function updateBoard(board) {
  const table = document.getElementById("board");
  // Clear previous solution
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = table.rows[i].cells[j].children[0];
      cell.value = board[i][j] || "";
    }
  }
}

function solve(board) {
// Overall method to check if board has been solved
    if (solved(board)) {
    return board;
  } else {
    const outcomes = nextBoards(board);
    const validBoards = possibleBoards(outcomes);
    return searchForSolution(validBoards);
  }
}

function searchForSolution(boards) {
  if (boards.length < 1) {
    return false;
  } else {
    // Check if current board (attempt) is a solution
    const attempt = boards.shift();
    const test = solve(attempt);
    if (test !== false) {
      return test;
    }
    // If not a solution continue on to the next board in the list
    else {
      return searchForSolution(boards);
    }
  }
}

function solved(board) {
  for (let box = 0; box < 9; box++) {
    for (let indices = 0; indices < 9; indices++) {
      if (board[box][indices] === null) {
        return false;
      }
    }
  }
  return true;
}

function nextBoards(board) {
  const res = [];
  const firstEmpty = findEmptySquare(board);
  if (firstEmpty !== undefined) {
    const y = firstEmpty[0];
    const x = firstEmpty[1];
    for (var i = 1; i <= 9; i++) {
      var newBoard = [...board];
      var row = [...newBoard[y]];
      row[x] = i;
      newBoard[y] = row;
      res.push(newBoard);
    }
  }
  return res;
}

function findEmptySquare(board) {
  for (let box = 0; box < 9; box++) {
    for (let indices = 0; indices < 9; indices++) {
      if (board[box][indices] == null) {
        return [box, indices];
      }
    }
  }
}

function possibleBoards(boards) {
  return boards.filter((b) => validBoard(b));
}

function validBoard(board) {
  return rowGood(board) && columnGood(board) && boxGood(board);
}

function rowGood(board) {
  for (let i = 0; i < 9; i++) {
    const cur = [];
    for (let j = 0; j < 9; j++) {
      if (cur.includes(board[i][j])) {
        return false;
      } else if (board[i][j] !== null) {
        cur.push(board[i][j]);
      }
    }
  }
  return true;
}

function columnGood(board) {
  for (let i = 0; i < 9; i++) {
    const cur = [];
    for (let j = 0; j < 9; j++) {
      if (cur.includes(board[j][i])) {
        return false;
      } else if (board[j][i] !== null) {
        cur.push(board[j][i]);
      }
    }
  }
  return true;
}

function boxGood(board) {
  const boxCoords = [
    [0, 0],
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ];

  for (var x = 0; x < 9; x += 3) {
    for (var y = 0; y < 9; y += 3) {
      var cur = [];
      for (var i = 0; i < 9; i++) {
        var coordinates = [...boxCoords[i]];
        coordinates[0] += x;
        coordinates[1] += y;
        if (cur.includes(board[coordinates[0]][coordinates[1]])) {
          return false;
        } else if (board[coordinates[0]][coordinates[1]] != null) {
          cur.push(board[coordinates[0]][coordinates[1]]);
        }
      }
    }
  }
  return true;
}

initiate();
