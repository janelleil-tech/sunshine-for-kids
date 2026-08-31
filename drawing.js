const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let color = "#F28C63";
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.round(rect.width * ratio));
  canvas.height = Math.max(1, Math.round(rect.height * ratio));

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

function getPosition(event) {
  const rect = canvas.getBoundingClientRect();

  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

function startDrawing(event) {
  event.preventDefault();

  drawing = true;

  const point = getPosition(event);
  lastX = point.x;
  lastY = point.y;
}

function draw(event) {
  if (!drawing) return;

  event.preventDefault();

  const point = getPosition(event);

  ctx.strokeStyle = color;
  ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(point.x, point.y);
  ctx.stroke();

  lastX = point.x;
  lastY = point.y;
}

function stopDrawing() {
  drawing = false;
}

canvas.addEventListener("pointerdown", startDrawing);
canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("pointerleave", stopDrawing);


// Color buttons
document.querySelectorAll(".color-button").forEach(button => {
  button.addEventListener("click", () => {
    color = button.dataset.color;
  });
});


// Eraser
document.getElementById("eraser").addEventListener("click", () => {
  color = "#FFFFFF";
});


// Clear
document.getElementById("clear").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});


window.addEventListener("resize", resizeCanvas);

resizeCanvas();
