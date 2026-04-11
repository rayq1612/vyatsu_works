const fs = require('fs');

function solveSystem(matrix, constants) {
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (Math.abs(det) < 1e-10) return null;

    const x1 = (constants[0] * matrix[1][1] - matrix[0][1] * constants[1]) / det;
    const x2 = (matrix[0][0] * constants[1] - constants[0] * matrix[1][0]) / det;
    return [x1, x2];
}

function runTask() {
    try {
        const input = fs.readFileSync('data.txt', 'utf8')
            .split(/\s+/)
            .filter(s => s.length > 0)
            .map(Number);

        let cursor = 0;
        const targetF = [input[cursor++], input[cursor++]];
        const mCount = input[cursor++];
        const constraints = [];

        for (let i = 0; i < mCount; i++) {
            constraints.push({
                coeffs: [input[cursor++], input[cursor++]],
                limit: input[cursor++]
            });
        }
        
        constraints.push({ coeffs: [1, 0], limit: 0, isGe: true, label: 'x1 >= 0' });
        constraints.push({ coeffs: [0, 1], limit: 0, isGe: true, label: 'x2 >= 0' });

        let maxF = -Infinity;
        let bestVertex = null;
        const foundVertices = [];

        for (let i = 0; i < constraints.length; i++) {
            for (let j = i + 1; j < constraints.length; j++) {
                const res = solveSystem(
                    [constraints[i].coeffs, constraints[j].coeffs],
                    [constraints[i].limit, constraints[j].limit]
                );

                if (res) {
                    const isFeasible = constraints.every(c => {
                        const val = c.coeffs[0] * res[0] + c.coeffs[1] * res[1];
                        return c.isGe ? val >= c.limit - 1e-10 : val <= c.limit + 1e-10;
                    });

                    if (isFeasible) {
                        const currentF = targetF[0] * res[0] + targetF[1] * res[1];
                        const key = `${res[0].toFixed(6)},${res[1].toFixed(6)}`;
                        
                        if (!foundVertices.some(v => v.key === key)) {
                            foundVertices.push({ 
                                key, 
                                x1: res[0], 
                                x2: res[1], 
                                f: currentF 
                            });
                            
                            if (currentF > maxF) {
                                maxF = currentF;
                                bestVertex = res;
                            }
                        }
                    }
                }
            }
        }

        console.log("СПИСОК ВСЕХ ВЕРШИН МНОГОГРАННИКА:");
        console.log("------------------------------------");
        foundVertices.forEach((v, index) => {
            console.log(`${index + 1}. Координаты: [${v.x1.toFixed(2)}; ${v.x2.toFixed(2)}], F = ${v.f.toFixed(2)}`);
        });

        console.log("------------------------------------");
        if (bestVertex) {
            console.log(`ИТОГОВЫЙ МАКСИМУМ: F = ${maxF.toFixed(2)}`);
            console.log(`ДОСТИГАЕТСЯ В ВЕРШИНЕ: (${bestVertex[0].toFixed(2)}; ${bestVertex[1].toFixed(2)})`);
        }

    } catch (err) {
        console.error("Ошибка исполнения. Проверьте файл data.txt");
    }
}

runTask();