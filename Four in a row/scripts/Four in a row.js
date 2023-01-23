'use strict';


document.getElementById("info-button").addEventListener("click", () => showModalById('info-modal'));
document.getElementById("restart-button").addEventListener("click", () => showModalById('restart-modal'));
document.getElementById("back-button").addEventListener("click", () => showModalById('back-modal'));
document.querySelectorAll(".close-button").forEach(cross => cross.addEventListener('click', makeCloseEventFromThis));
document.querySelectorAll('.modal-background').forEach(modalWindow => {
    modalWindow.addEventListener('click', makeCloseEventFromModalBackground);
    modalWindow.addEventListener('close-event', closeEventListener);
});
document.getElementById('play-again-ok').addEventListener('click', restart);
document.getElementById('info-ok').addEventListener('click', makeCloseEventFromThis);
document.getElementById('restart-no').addEventListener('click', makeCloseEventFromThis);
document.getElementById('restart-ok').addEventListener('click', restart);
document.getElementById('back-no').addEventListener('click', makeCloseEventFromThis);
document.getElementById('back-ok').addEventListener('click', back);

{
    const fieldWidth = 7;
    const fieldHeight = 6;
    const cells = [];
    let filledCellsNum = 0; 
    let unlocked = true; 
    let flagPlayer = true; // true -> player1; false -> player2
    let player1, player2;
    const firstCircle = document.getElementById("first_circle");
    const secondCircle = document.getElementById("second_circle");

    (function getColorsFromLocalStorage() {
        const localPlayerOne = localStorage.getItem('playerOneColor');
        const localPlayerTwo = localStorage.getItem('playerTwoColor');

        if (localPlayerOne && localPlayerTwo) {
            setColors([localPlayerOne, localPlayerTwo]);
        }
        else {
            setColors(getRandomColors());
        }

    })();

    (function addCells() {
        const field = document.getElementById("field");

        for (let i = 0; i < fieldWidth; i++) {
            cells[i] = [];
            cells[i].occupiedCells = 0;
        }

        for (let j = 0; j < fieldHeight; j++) {
            for (let i = 0; i < fieldWidth; i++) {
                cells[i][j] = document.createElement('div');
                cells[i][j].className = 'cell';
                cells[i][j].column = i;
                cells[i][j].filled = false;
                cells[i][j].addEventListener('click', makeMove);
                field.appendChild(cells[i][j]);
            }
        }
    })();

    function makeMove() {
        if (unlocked && cells[this.column].occupiedCells < fieldHeight) {
            unlocked = false;
            animation(this.column);
        }
    }

    function animation(column) {
        let interval = 0;
        let i = 0;

        for (i; i < cells[column].length; i++) {
            if (cells[column][i].filled) break;
            setTimeout(curCell => curCell.style.backgroundColor = player(), interval, cells[column][i]);
            interval += 75;
            setTimeout(curCell => curCell.style.backgroundColor = '', interval, cells[column][i]);
        }

        setTimeout(fillCell, interval, cells[column][i - 1]);
    }

    function fillCell(cell) {
        cell.style.backgroundColor = player();
        cell.filled = true;
        cells[cell.column].occupiedCells++;
        filledCellsNum++;
        endOrNextPlayer();
    }

    function endOrNextPlayer() {
        if (filledCellsNum === fieldHeight * fieldWidth) {
            endGame("Draw!");
            return;
        }

        const winRow = detectWinRow();

        if (!winRow) {
            nextPlayer();
            return;
        }

        winRow.forEach(winCell => winCell.style.transform = 'scale(1.2, 1.2)');
        endGame(`${playerColoredNumeral()} player won! Congratulations!`);
    }

    function nextPlayer() {
        flagPlayer = !flagPlayer;
        currentPlayerIndicator();
        unlocked = true;
    }

    function currentPlayerIndicator() {
        [firstCircle.style.transform, secondCircle.style.transform] = [secondCircle.style.transform, firstCircle.style.transform];
        const pText = document.getElementById("player-move-text");
        pText.innerHTML = `${playerColoredNumeral()} plays now!`;
    }

    function endGame(htmlEndMessage) {
        const endModal = document.getElementById("end-modal");
        const mBody = endModal.querySelector(".modal-body");
        mBody.innerHTML = htmlEndMessage;
        showModal(endModal);
    }

    function detectWinRow() {
        const diagonals = [
            [cells[0][0], cells[1][1], cells[2][2], cells[3][3], cells[4][4], cells[5][5]],
            [cells[1][0], cells[2][1], cells[3][2], cells[4][3], cells[5][4], cells[6][5]],
            [cells[6][0], cells[5][1], cells[4][2], cells[3][3], cells[2][4], cells[1][5]],
            [cells[5][0], cells[4][1], cells[3][2], cells[2][3], cells[1][4], cells[0][5]],
            [cells[0][1], cells[1][2], cells[2][3], cells[3][4], cells[4][5]],
            [cells[2][0], cells[3][1], cells[4][2], cells[5][3], cells[6][4]],
            [cells[6][1], cells[5][2], cells[4][3], cells[3][4], cells[2][5]],
            [cells[4][0], cells[3][1], cells[2][2], cells[1][3], cells[0][4]],
            [cells[0][3], cells[1][2], cells[2][1], cells[3][0]],
            [cells[0][2], cells[1][3], cells[2][4], cells[3][5]],
            [cells[3][0], cells[4][1], cells[5][2], cells[6][3]],
            [cells[3][5], cells[4][4], cells[5][3], cells[6][2]]
        ];

        const height = cells[0].length;
        const width = cells.length;
        const horizontals = [];

        for (let j = 0; j < height; j++) {
            horizontals[j] = [];
            for (let i = 0; i < width; i++) {
                horizontals[j][i] = cells[i][j];
            }
        }


        for (let bigArr of [cells, horizontals, diagonals]) {
            for (let nestArr of bigArr) {
                let count = 0;
                let curColor, prevColor;
                for (let i = 1; i < nestArr.length; i++) {
                    curColor = nestArr[i].style.backgroundColor;
                    prevColor = nestArr[i - 1].style.backgroundColor;

                    if (nestArr[i].filled && curColor === prevColor) {
                        count++;
                    } else {
                        count = 0;
                    }

                    if (count === 3) {
                        return [nestArr[i - 3], nestArr[i - 2], nestArr[i - 1], nestArr[i]];
                    }
                }
            }
        }

        return false;
    }

    function playerColoredNumeral() {
        return `<font color=${player()}> ${flagPlayer ? `First` : `Second`} </font>`;
    }

    function player() {
        return flagPlayer ? player1 : player2;
    }

    function setColors(colorsArr) {
        [player1, player2] = colorsArr;
        firstCircle.style.backgroundColor = player1;
        secondCircle.style.backgroundColor = player2;
    }

    function getRandomColors() {
        return getRand(0, 1) ? ["gold", "red"] : ["red", "gold"];
    }

    function getRand(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

function restart() {
    location.reload();
}

function back() {
    location.replace('index.html');
}

function showModalById(ID) {
    showModal(document.getElementById(ID));
}

function showModal(modal) {
    modal.style.display = "block";
}

function makeCloseEventFromModalBackground(event) {
    if (event.target === this) {
        makeCloseEvent(this);
    }
}

function closeEventListener() {
    this.style.display = "none";
}

function makeCloseEventFromThis() {
    makeCloseEvent(this);
}

function makeCloseEvent(eventMaker) {
    const closeEvent = new Event('close-event', {
        bubbles: true
    });
    eventMaker.dispatchEvent(closeEvent);
}
