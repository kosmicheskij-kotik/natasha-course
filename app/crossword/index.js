(() => {
    const NUM_ROWS = 30;
    const NUM_COLS = 20;
    const PERCENT_SPOTS = 82;
    const STATE_UNSELECTED = 0;
    const STATE_SELECTED = 1;
    const STATE_MARKED = 2;

    const board = new Array(NUM_ROWS);
    const tableCells = new Array(NUM_ROWS + 1);
    const tbody = document.getElementById('game-table-body');

    let percentSpots = undefined;
    let currentSelectState = undefined;

    document.getElementById('reset').addEventListener('click', reset);
    document.getElementById('solve').addEventListener('click', solve);
    document.getElementById('start').addEventListener('click', start);

    makeTable();
    start();

    function start() {
        percentSpots = PERCENT_SPOTS;

        makeGame();
        setHints();
        reset();
    }

    function setHints() {
        // horizontal
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            let row = [];
            let count = 0;
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];

                if (cell.isSpot) {
                    count++;
                } else if (count > 0) {
                    row.push(count);
                    count = 0;
                }
            }

            if (count > 0) {
                row.push(count);
            }

            let infoCell = tableCells[i][0];
            while (infoCell.firstChild) {
                infoCell.removeChild(infoCell.firstChild);
            }
            let div = document.createElement('div');

            row.forEach(num => {
                let span = document.createElement('span');
                span.innerHTML = num;
                div.appendChild(span);
            });

            infoCell.appendChild(div);
        }

        // vertical
        for (let j = 1; j < NUM_COLS + 1; j++) {
            let col = [];
            let count = 0;
            for (let i = 1; i < NUM_ROWS + 1; i++) {
                let cell = board[i - 1][j - 1];

                if (cell.isSpot) {
                    count++;
                } else if (count > 0) {
                    col.push(count);
                    count = 0;
                }
            }

            if (count > 0) {
                col.push(count);
            }

            let infoCell = tableCells[0][j];
            while (infoCell.firstChild) {
                infoCell.removeChild(infoCell.firstChild);
            }

            let div = document.createElement('div');
            col.forEach(num => {
                let span = document.createElement('span');
                span.innerHTML = num;
                div.appendChild(span);
            });

            infoCell.appendChild(div);
        }

        // click listeners
        let spans = document.querySelectorAll('.info-cell span');
        spans.forEach(span => {
            span.addEventListener('click', e => {
                let target = e.target;
                if (target.classList.contains('checked')) {
                    target.classList.remove('checked');
                } else {
                    target.classList.add('checked');
                }
            });
        });
    }

    function checkForWin() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let tableCell = tableCells[i][j];
                let cell = board[i - 1][j - 1];
                if ((cell.isSpot && cell.selectedState !== STATE_SELECTED) ||
                    (!cell.isSpot && cell.selectedState === STATE_SELECTED)) {
                    return;
                }
            }
        }

        // give enough time for css of last cell to update
        setTimeout(() => alert('You win!'), 50);
    }

    // updates game cells, not info cells
    function updateTable() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let tableCell = tableCells[i][j];
                let cell = board[i - 1][j - 1];
                if (cell.selectedState === STATE_SELECTED) {
                    tableCell.classList.add("checked");
                    tableCell.classList.remove("marked")
                } else if (cell.selectedState === STATE_MARKED) {
                    tableCell.classList.add("marked");
                    tableCell.classList.remove("checked")
                } else {
                    tableCell.classList.remove("checked");
                    tableCell.classList.remove("marked");
                }
            }
        }
    }

    function makeGame() {
        for (let i = 0; i < NUM_ROWS; i++) {
            board[i] = new Array(NUM_COLS);
            for (let j = 0; j < NUM_COLS; j++) {
                board[i][j] = {
                    selectedState: STATE_UNSELECTED,
                    isSpot: Math.random() >= 1 - (percentSpots / 100)
                }
            }
        }
    }

    function makeTable() {
        let mouseoverListener = e => {
            let tableCell = e.target;
            let row = tableCell.dataset.row;
            let col = tableCell.dataset.col;
            if (row >= 0 && col >= 0 && e.buttons === 1 && currentSelectState !== undefined) {
                e.preventDefault();
                let cell = board[row][col];

                cell.selectedState = currentSelectState;


                updateTable();
                checkForWin();
            }
        };

        for (let i = 0; i < NUM_ROWS + 1; i++) {
            tableCells[i] = new Array(NUM_COLS + 1);
            let row = document.createElement('tr');

            for (let j = 0; j < NUM_COLS + 1; j++) {
                let cell = document.createElement('td');
                let isInfoCell = i === 0 || j === 0;
                cell.setAttribute('data-row', i - 1);
                cell.setAttribute('data-col', j - 1);
                let cellClass = isInfoCell ? 'info-cell' : 'game-cell';
                cell.setAttribute('class', cellClass);
                cell.addEventListener('mouseover', mouseoverListener);
                tableCells[i][j] = cell;
                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }

        document.addEventListener('mousedown', e => {
            let tableCell = e.target;
            let row = tableCell.dataset.row;
            let col = tableCell.dataset.col;

            if (row >= 0 && col >= 0) {
                e.preventDefault();
                let cell = board[row][col];

                switch (cell.selectedState) {
                    case STATE_UNSELECTED:
                        cell.selectedState = STATE_SELECTED;
                        break;
                    case STATE_SELECTED:
                        cell.selectedState = STATE_MARKED;
                        break;
                    case STATE_MARKED:
                        cell.selectedState = STATE_UNSELECTED;
                        break;
                }

                currentSelectState = cell.selectedState;

                updateTable();
                checkForWin();
            } else {
                currentSelectState = undefined;
            }
        });
    }

    function reset() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];
                cell.selectedState = STATE_UNSELECTED;
            }
        }

        updateTable();
    }

    function solve() {
        for (let i = 1; i < NUM_ROWS + 1; i++) {
            for (let j = 1; j < NUM_COLS + 1; j++) {
                let cell = board[i - 1][j - 1];
                cell.selectedState = cell.isSpot ? STATE_SELECTED : STATE_UNSELECTED;
            }
        }

        updateTable();
        checkForWin();
    }
})();
