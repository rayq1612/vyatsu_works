const fs = require('fs');

function solveSimplex(filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let { matrix, c, b, isMin } = data;

    if (isMin) {
        c = c.map(val => -val);
    }

    const numConstraints = matrix.length;
    const numVars = c.length;

    let table = matrix.map((row, i) => {
        const slacks = new Array(numConstraints).fill(0);
        slacks[i] = 1;
        return [...row, ...slacks, b[i]];
    });

    const fRow = [...c.map(v => -v), ...new Array(numConstraints).fill(0), 0];
    table.push(fRow);

    const printTable = (t) => {
        console.table(t.map(r => Object.fromEntries(r.map((v, i) => [`col_${i}`, v.toFixed(2)]))));
    };

    while (true) {
        const lastRow = table[table.length - 1];
        const lastColIdx = lastRow.length - 1;

        let pivotCol = -1;
        let minVal = 0;
        for (let j = 0; j < lastColIdx; j++) {
            if (lastRow[j] < minVal) {
                minVal = lastRow[j];
                pivotCol = j;
            }
        }

        if (pivotCol === -1) break;

        let pivotRow = -1;
        let minRatio = Infinity;

        for (let i = 0; i < numConstraints; i++) {
            const val = table[i][pivotCol];
            if (val > 1e-9) {
                const ratio = table[i][lastColIdx] / val;
                if (ratio < minRatio) {
                    minRatio = ratio;
                    pivotRow = i;
                }
            }
        }

        if (pivotRow === -1) {
            console.log("Целевая функция не ограничена сверху.");
            return;
        }

        const pivotElement = table[pivotRow][pivotCol];
        table[pivotRow] = table[pivotRow].map(x => x / pivotElement);

        for (let i = 0; i < table.length; i++) {
            if (i !== pivotRow) {
                const factor = table[i][pivotCol];
                table[i] = table[i].map((val, j) => val - factor * table[pivotRow][j]);
            }
        }
        
        printTable(table);
    }

    const resultF = table[table.length - 1][table[table.length - 1].length - 1];
    const xValues = new Array(numVars).fill(0);

    for (let j = 0; j < numVars; j++) {
        let col = table.map(row => row[j]);
        if (col.filter(v => Math.abs(v - 1) < 1e-9).length === 1 && col.filter(v => Math.abs(v) < 1e-9).length === table.length - 1) {
            let rowIndex = col.findIndex(v => Math.abs(v - 1) < 1e-9);
            xValues[j] = table[rowIndex][table[rowIndex].length - 1];
        }
    }

    console.log("Результаты:");
    xValues.forEach((val, i) => console.log(`x${i + 1} = ${val.toFixed(2)}`));
    console.log(`f = ${isMin ? (-resultF).toFixed(2) : resultF.toFixed(2)}`);
}

solveSimplex('./task.json');