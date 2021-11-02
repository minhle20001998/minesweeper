import {
    TILE_STATUSES,
    createBoard,
    markTile,
    revealTile,
    checkWin,
    checkLose,
} from "./minesweeper.js"

const BOARD_SIZE = 9
const NUMBER_OF_MINES = 10

let board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftText = document.querySelector("[data-mine-count]")
const messageText = document.querySelector(".subtext")
const iconBtn = document.querySelector(".icon");
const flagCount = document.querySelector(".flag-count");
const timeCount = document.querySelector(".time-count");
let timeout;
function main() {
    //initial
    iconBtn.classList.remove(iconBtn.classList[1]);
    iconBtn.classList.add("smiling");
    flagCount.textContent = NUMBER_OF_MINES
    timeCount.textContent = 0
    if (timeout) {
        clearTimeout(timeout);
    }
    loopTimer()
    // 
    boardElement.addEventListener('click', handleBoardClick)
    boardElement.addEventListener('contextmenu', handleFlagClick)
    board.forEach(row => {
        row.forEach(tile => {
            boardElement.append(tile.element)
        })
    })
    boardElement.style.setProperty("--size", BOARD_SIZE)
    minesLeftText.textContent = NUMBER_OF_MINES
}
main();

function loopTimer() {
    timeout = setTimeout(loopTimer, 1000)
    timeCount.textContent = +timeCount.textContent + 1
}

function handleBoardClick(e) {
    const [x, y] = e.target.id.split('-');
    revealTile(board, {
        element: e.target,
        x: +x,
        y: +y,
        status: e.target.getAttribute('data-status'),
        getBoardSize: BOARD_SIZE,
        getNumOfMines: NUMBER_OF_MINES
    });
    checkGameEnd()
}

function handleFlagClick(e) {
    const [x, y] = e.target.id.split('-');
    e.preventDefault()
    markTile({
        element: e.target,
        x: +x,
        y: +y,
        status: e.target.getAttribute('data-status'),
        getBoardSize: BOARD_SIZE,
        getNumOfMines: NUMBER_OF_MINES
    })
    listMinesLeft()
    checkGameEnd()
}

iconBtn.addEventListener('click', () => {
    removeOldBoard();
    board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
    main();
    console.log(board)
})


function removeOldBoard() {
    const allCells = boardElement.querySelectorAll('div');
    allCells.forEach((cell) => {
        cell.remove();
    })
}

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
    }, 0)
    flagCount.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)
    if (win || lose) {
        stopProp()
    }

    if (win) {
        iconBtn.classList.remove(iconBtn.classList[1]);
        iconBtn.classList.add("win");
        messageText.textContent = "You Win"
    }
    if (lose) {
        iconBtn.classList.remove(iconBtn.classList[1]);
        iconBtn.classList.add("lose");
        messageText.textContent = "You Lose"
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
                if (tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp() {
    boardElement.removeEventListener('click', handleBoardClick)
    boardElement.removeEventListener('contextmenu', handleFlagClick)
}