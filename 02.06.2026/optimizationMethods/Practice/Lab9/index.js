const solveMonteCarlo = (iterations = 100000) => {
    let bestZ = -Infinity;
    let bestCoords = { x1: null, x2: null };

    const minX = 0;
    const maxX = 10;

    for (let i = 0; i < iterations; i++) {
        const x1 = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        const x2 = Math.floor(Math.random() * (maxX - minX + 1)) + minX;

        const cond1 = -x1 + 3 * x2 <= 6;
        const cond2 = x1 + (1 / 7) * x2 <= 5;

        if (cond1 && cond2) {
            const currentZ = 7 * x1 + 9 * x2;

            if (currentZ > bestZ) {
                bestZ = currentZ;
                bestCoords = { x1, x2 };
            }
        }
    }

    if (bestCoords.x1 !== null) {
        console.log("=== Результат метода Монте-Карло ===");
        console.log(`Оптимальные значения: x1 = ${bestCoords.x1}, x2 = ${bestCoords.x2}`);
        console.log(`Максимальное значение Z = ${bestZ}`);
    } else {
        console.log("Допустимых решений не найдено.");
    }
};

solveMonteCarlo();