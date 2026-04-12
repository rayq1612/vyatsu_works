const fs = require('fs');

function solveTwoPhaseSimplex(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let { matrix, c, b, isMin } = data;

    const numConstraints = matrix.length;
    const numVars = c.length;

    let table = matrix.map((row, i) => {
        const rowData = [...row];
        const slacks = new Array(numConstraints).fill(0);
        slacks[i] = rowData[i] >= 0 ? 1 : -1; 
        const artificials = new Array(numConstraints).fill(0);
        artificials[i] = 1;
        return [...rowData, ...slacks, ...artificials, b[i]];
    });

    let lRow = new Array(numVars + 2 * numConstraints + 1).fill(0);
    for (let i = 0; i < numConstraints; i++) {
        for (let j = 0; j < lRow.length; j++) {
            lRow[j] -= table[i][j];
        }
    }
    table.push(lRow);

    const runSimplex = (tab, isPhaseOne) => {
        while (true) {
            const lastRow = tab[tab.length - 1];
            let pivotCol = -1;
            let minVal = -1e-9;
            for (let j = 0; j < lastRow.length - 1; j++) {
                if (lastRow[j] < minVal) {
                    minVal = lastRow[j];
                    pivotCol = j;
                }
            }
            if (pivotCol === -1) return true;

            let pivotRow = -1;
            let minRatio = Infinity;
            for (let i = 0; i < tab.length - 1; i++) {
                if (tab[i][pivotCol] > 1e-9) {
                    const ratio = tab[i][tab[i].length - 1] / tab[i][pivotCol];
                    if (ratio < minRatio) {
                        minRatio = ratio;
                        pivotRow = i;
                    }
                }
            }
            if (pivotRow === -1) return false;

            const pivotVal = tab[pivotRow][pivotCol];
            tab[pivotRow] = tab[pivotRow].map(x => x / pivotVal);
            for (let i = 0; i < tab.length; i++) {
                if (i !== pivotRow) {
                    const factor = tab[i][pivotCol];
                    tab[i] = tab[i].map((v, j) => v - factor * tab[pivotRow][j]);
                }
            }
            console.table(tab.map(r => r.map(v => v.toFixed(2))));
        }
    };

    console.log("--- Этап 1: Вспомогательная задача ---");
    runSimplex(table, true);

    if (Math.abs(table[table.length - 1][table[0].length - 1]) > 1e-9) {
        console.log("Область допустимых решений — пустое множество");
        return;
    }

    console.log("--- Этап 2: Основная задача ---");
    let mainTable = table.slice(0, -1).map(row => [
        ...row.slice(0, numVars + numConstraints), 
        row[row.length - 1]
    ]);

    let fRow = new Array(numVars + numConstraints + 1).fill(0);
    const coeffs = isMin ? c : c.map(v => -v);
    coeffs.forEach((v, j) => fRow[j] = v);

    mainTable.forEach((row, i) => {
        for (let j = 0; j < numVars; j++) {
            if (Math.abs(fRow[j]) > 1e-9 && Math.abs(row[j] - 1) < 1e-9) {
                const factor = fRow[j];
                fRow = fRow.map((v, idx) => v - factor * row[idx]);
            }
        }
    });
    mainTable.push(fRow);

    if (!runSimplex(mainTable, false)) {
        console.log("Целевая функция не ограничена");
        return;
    }

    const resultF = mainTable[mainTable.length - 1][mainTable[0].length - 1];
    console.log(`Оптимальное значение f: ${isMin ? resultF.toFixed(2) : (-resultF).toFixed(2)}`);
}

solveTwoPhaseSimplex('./task.json');