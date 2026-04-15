export function createGridLinesSvg(
    cellSize: number,
    subdivisions: number,
    majorColor: string,
    minorColor: string,
) {
    const subdivCoords = getSubdivCoords(cellSize, subdivisions)
        .map(_ => _ + 1);
    const lines = [
        `<svg xmlns="http://www.w3.org/2000/svg"
        width="${cellSize}"
        height="${cellSize}"
        viewBox="0 0 ${cellSize} ${cellSize}">`
    ];
    // Minor lines
    for (const c of subdivCoords) {
        lines.push(
            `<path d="M0,${c} H ${cellSize}" stroke="${minorColor}" stroke-width="1"/>`
        );
        lines.push(
            `<path d="M${c},0 V ${cellSize}" stroke="${minorColor}" stroke-width="1"/>`
        );
    }
    // Major lines
    lines.push(`<path d="M0,1 H ${cellSize}" stroke="${majorColor}" stroke-width="1"/>`);
    lines.push(`<path d="M1,0 V ${cellSize}" stroke="${majorColor}" stroke-width="1"/>`);
    lines.push('</svg>');
    return lines.join('');
}

export function createGridDotsSvg(
    cellSize: number,
    subdivisions: number,
    majorColor: string,
    majorRadius = 2,
    minorColor: string,
    minorRadius = 1,
) {
    const minorCoords = [0, ...getSubdivCoords(cellSize, subdivisions), cellSize];
    const majorCoords = [0, cellSize];
    const lines = [
        `<svg xmlns="http://www.w3.org/2000/svg"
        width="${cellSize}"
        height="${cellSize}"
        viewBox="0 0 ${cellSize} ${cellSize}">`,
    ];
    if (minorRadius) {
        for (const x of minorCoords) {
            for (const y of minorCoords) {
                lines.push(
                    `<circle cx="${x}" cy="${y}" r="${minorRadius}" fill="${minorColor}"/>`
                );
            }
        }
    }
    if (majorRadius) {
        for (const x of majorCoords) {
            for (const y of majorCoords) {
                lines.push(
                    `<circle cx="${x}" cy="${y}" r="${majorRadius}" fill="${majorColor}"/>`
                );
            }
        }
    }
    lines.push('</svg>');
    return lines.join('');
}

function getSubdivCoords(cellSize: number, subdivisions: number) {
    const subdivCoords: number[] = [];
    const k = Math.round(cellSize / subdivisions);
    for (let i = 1; i < subdivisions; i++) {
        subdivCoords.push(k * i);
    }
    return subdivCoords;
}
