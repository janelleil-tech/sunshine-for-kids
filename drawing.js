const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let lastX = 0;
let lastY = 0;
let color = document.getElementById("colorPicker").value;
let size = Number(document.getElementById("brushSize").value);
const history = [];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  // Keep the drawing crisp on phones/tablets with high pixel density.
  const ratio = window.devicePixelRatio || 1;
  const old = document.createElement("canvas");
  old.width = canvas.width;
  old.height = canvas.height;
  old.getContext("2d").drawImage(canvas, 0, 0);

  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  if (old.width && old.height) {
    ctx.drawImage(old, 0, 0, old.width, old.height,
      0, 0, rect.width, rect.height);
  }
}

function position(event) {
  const rect = canvas.getBoundingClientRect();
  const point = event.touches ? event.touches[0] : event;
  return {
    x: point.clientX - rect.left,
    y: point.clientY - rect.top
  };
}

function start(event) {
  event.preventDefault();
  drawing = true;
  const p = position(event);
  lastX = p.x;
  lastY = p.y;
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

function move(event) {
  if (!drawing) return;
  event.preventDefault();
  const p = position(event);

  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();

  lastX = p.x;
  lastY = p.y;
}

function stop() {
  drawing = false;
}

canvas.addEventListener("pointerdown", start);
canvas.addEventListener("pointermove", move);
canvas.addEventListener("pointerup", stop);
canvas.addEventListener("pointercancel", stop);
canvas.addEventListener("pointerleave", stop);

document.getElementById("colorPicker").addEventListener("input", e => {
  color = e.target.value;
});

document.getElementById("brushSize").addEventListener("change", e => {
  size = Number(e.target.value);
});

document.getElementById("undo").addEventListener("click", () => {
  const previous = history.pop();
  if (previous) ctx.putImageData(previous, 0, 0);
});

document.getElementById("clear").addEventListener("click", () => {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
