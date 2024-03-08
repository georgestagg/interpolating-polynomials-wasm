
const width = 600;
const height = 300;
const marginTop = 50;
const marginLeft = 40;
const marginRight = 20;
const marginBottom = 30;

let points = []
let coef = [];
const plot = document.getElementById("plot");

// Mouse and touch controls
function handleTouchStart(evt) {
  evt.preventDefault();
}

function handleMouseDown(evt) {
  var x = evt.offsetX != null ? evt.offsetX : evt.originalEvent.layerX;
  var y = evt.offsetY != null ? evt.offsetY : evt.originalEvent.layerY;
  mx = 40 * (x - marginLeft) / (width - marginLeft - marginRight) - 20;
  my = -20 * (y - marginTop) / (height - marginTop - marginBottom) + 10;
  points.push({ x: mx, y: my });
  coef = doPolynomial(points);
  drawPlot(mx, my);
}

function handleMouseMove(evt) {
  var x = evt.offsetX != null ? evt.offsetX : evt.originalEvent.layerX;
  var y = evt.offsetY != null ? evt.offsetY : evt.originalEvent.layerY;
  mx = 40 * (x - marginLeft) / (width - marginLeft - marginRight) - 20;
  my = -20 * (y - marginTop) / (height - marginTop - marginBottom) + 10;
  drawPlot(mx, my);
}

// Handle Wasm start and abort
function doStart() {
  plot.addEventListener("mousemove", handleMouseMove);
  plot.addEventListener("mousedown", handleMouseDown);
  plot.addEventListener('touchstart', handleTouchStart);
  document.getElementById("clear").addEventListener('click', reset);
  document.getElementById("sin").addEventListener('click', resetSin);
  reset();
}

function doAbort() {
  const output = document.getElementById("output")
  output.innerHTML = "An error occurred while starting Wasm:<br>";
  output.innerHTML += "See the JavaScript console for details.";
}

// Reset to initial points
function reset() {
  points = [{ x: 0, y: 0 },];
  coef = doPolynomial(points);
  drawPlot(300, 150);
}

function resetSin() {
  const xDomain = Array.from({ length: 26 }, (_, i) => -12 + i);
  points = xDomain.map((x) => {
    return { x, y: Math.sin(x) };
  })
  coef = doPolynomial(points);
  drawPlot(300, 150);
}

function doPolynomial(points) {
  // Allocate Wasm memory for integer length argument
  const n = points.length;
  const n_ptr = Module._malloc(4);
  Module.HEAP32[n_ptr / 4] = n;

  // Construct a Vandermonde matrix in Wasm memory
  const A = new Float64Array(n * n);
  for (let p = 0; p < n; p++) {
    points.forEach((point, i) => {
      A[p * n + i] = point.x ** p;
    });
  }
  const A_ptr = Module._malloc(n * n * 8);
  Module.HEAPF64.set(A, A_ptr / 8);

  // Construct B vector in Wasm memory
  const B = new Float64Array(points.map((point) => point.y));
  const B_ptr = Module._malloc(n * 8);
  Module.HEAPF64.set(B, B_ptr / 8);

  Module._vandermonde_(A_ptr, B_ptr, n_ptr);
  const out = Module.HEAPF64.subarray(B_ptr / 8, B_ptr / 8 + n);

  // Wasm memory cleanup
  Module._free(n_ptr);
  Module._free(A_ptr);
  Module._free(B_ptr);

  return out;
}

function drawPlot(mx, my) {
  // Update text information
  output.innerHTML = "Polynomial coefficients:\n";
  output.innerHTML += Array.from(coef).map((v) => v.toPrecision(2)).join(" ");

  const xDomain = Array.from({ length: 401 }, (_, i) => -20 + i / 10.);
  const line = xDomain.map((x) => {
    let y = 0;
    for (let p = 0; p < coef.length; p++) {
      y += coef[p] * x ** p
    }
    // Avoid breaking plot with giant y values
    y = Math.max(Math.min(y, 20), -20);
    return { x, y };
  })

  const plot = Plot.plot({
    marginTop,
    marginLeft,
    marginRight,
    marginBottom,
    width,
    height,
    x: { domain: [-20, 20] },
    y: { domain: [-10, 10] },
    marks: [
      Plot.text(['Polynomial Interpolation'], { frameAnchor: "Top", dy: -25 }),
      Plot.dot(points, { x: "x", y: "y" }),
      Plot.line(line, { x: "x", y: "y", stroke: "#E00" }),
      Plot.ruleX([mx], { stroke: "#CCC" }),
      Plot.ruleY([my], { stroke: "#CCC" }),
    ],
  });

  const div = document.querySelector("#plot");
  while (div.firstChild) {
    div.removeChild(div.lastChild);
  }
  div.append(plot);
}
