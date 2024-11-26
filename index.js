const select = document.getElementById("select");

const defaultCanvasState = [
  [0, 0, 0, 0, 1],
  [0, 0, 0, 1, 0],
  [0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0],
  [1, 0, 0, 0, 0],
];

for (let key of Object.keys(ALPHABET)) {
  const option = document.createElement("option");
  option.value = key;
  option.innerText = key;

  select.appendChild(option);
}

function drawState(canvasState, ctx) {
  const squareWidth = ctx.canvas.width / 5;
  const squareHeight = ctx.canvas.height / 5;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < canvasState.length; i++) {
    for (let j = 0; j < canvasState[i].length; j++) {
      const cell = canvasState[i][j];

      ctx.strokeStyle = "black";
      ctx.fillStyle = "black";

      ctx.strokeRect(
        i * squareWidth,
        j * squareHeight,
        squareWidth,
        squareHeight
      );
      if (cell === 1) {
        ctx.fillRect(
          j * squareWidth,
          i * squareHeight,
          squareWidth,
          squareHeight
        );
      }
    }
  }
}

function animateState(canvasState, ctx, currentState) {
  if (currentState === undefined) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const initialState = canvasState.map(function fillLineWithInitialValue(
      line
    ) {
      return line.map(function fillCellWithInitialValue() {
        return 0;
      });
    });

    drawState(initialState, ctx);
    animateState(canvasState, ctx, initialState);
    return;
  }

  setTimeout(function delayRendering() {
    requestAnimationFrame(function renderNextCell() {
      for (let i = currentState.length - 1; i >= 0; i--) {
        for (let j = 0; j < currentState.length; j++) {
          if (canvasState[i][j] === 1 && currentState[i][j] === 0) {
            currentState[i][j] = 1;
            drawState(currentState, ctx);
            animateState(canvasState, ctx, currentState);
            return;
          }
        }
      }
    });
  }, 1000 / 5);
}

(function init() {
  const canvas = document.getElementById("canvas");

  if (!canvas.getContext) {
    return;
  }

  const ctx = canvas.getContext("2d");

  drawState(defaultCanvasState, ctx);

  select.addEventListener("change", function handleSelectChange(e) {
    const selectedKey = e.target.value;

    const shouldAnimate = document.getElementById("animate").checked;

    const selectedState = ALPHABET[selectedKey] || defaultCanvasState;

    const renderingFn = shouldAnimate ? animateState : drawState;

    renderingFn.call(null, selectedState, ctx);
  });
})();
