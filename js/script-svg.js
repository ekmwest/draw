let isDrawing = false;
let points = [];
const svg = document.querySelector('svg');
let svgRect = document.querySelector('svg').getBoundingClientRect();
const smoothing = 0.2;

document.addEventListener('pointerdown', event => {
    log('down');
    points = [];
    const { x, y } = getPosition(event);
    points.push([x, y]);
    document.addEventListener('pointermove', move, { passive: true });
});

document.addEventListener('pointerup', event => {
    log('up');
    const { x, y } = getPosition(event);
    points.push([x, y]);
    document.removeEventListener('pointermove', move, { passive: true });
    draw();
});

function move(event) {
    log('move');

    const { x, y } = getPosition(event);

    const dX = x - points[points.length - 1][0];
    const dY = y - points[points.length - 1][1];
    const d = Math.hypot(dX, dY);
    if (d > 10) {
        points.push([x, y]);
        draw();
    }
}

function getPosition(event) {
    return { x: event.x - svgRect.x, y: event.y - svgRect.y };
}

function draw() {
    // svg.append(createElementFromHtml(svgPath(points, bezierCommand)));
    svg.innerHTML = svgPath(points, bezierCommand)
}

function createElementFromHtml(html) {

    // REQUIREMENT: Single root element in html markup
    // createElementFromHtml('<div></div><p></p>'); => Will not work
    // createElementFromHtml('<div><p></p></div>'); => OK

    var template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
};

function svgPath(points, command) {
    // build the d attributes by looping over the points
    const d = points.reduce((acc, point, i, a) => i === 0
        ? `M ${point[0]},${point[1]}`
        : `${acc} ${command(point, i, a)}`
        , '')
    return `<path d="${d}" fill="none" stroke="#0780ff" stroke-width="4" />`
}

function bezierCommand(point, i, a) {

    // start control point
    const cps = controlPoint(a[i - 1], a[i - 2], point)

    // end control point
    const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
    return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`
}

function controlPoint(current, previous, next, reverse) {

    // When 'current' is the first or last point of the array
    // 'previous' or 'next' don't exist.
    // Replace with 'current'
    const p = previous || current
    const n = next || current

    // Properties of the opposed-line
    const o = line(p, n)

    // If is end-control-point, add PI to the angle to go backward
    const angle = o.angle + (reverse ? Math.PI : 0)
    const length = o.length * smoothing

    // The control point position is relative to the current point
    const x = current[0] + Math.cos(angle) * length
    const y = current[1] + Math.sin(angle) * length
    return [x, y]
}

function line(pointA, pointB) {
    const lengthX = pointB[0] - pointA[0]
    const lengthY = pointB[1] - pointA[1]
    return {
        length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
        angle: Math.atan2(lengthY, lengthX)
    }
}

function log(msg) {
    const logElement = document.querySelector('.log');
    logElement.innerHTML = `${logElement.innerHTML}\n<p>${msg}</p>`;
    logElement.scroll(0, 10000);
}