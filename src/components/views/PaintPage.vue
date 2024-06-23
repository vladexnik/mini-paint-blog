<template>
  <div class="container">
    <section class="tools-board">
      <div class="row">
        <label class="title">Shapes</label>
        <ul class="options">
          <li
            class="option"
            :class="{ active: selectedTool === 'circle' }"
            id="circle"
            @click="selectTool('circle')"
          >
            <img src="../../icons/circle.svg" alt="circle" />
            <span>Circle</span>
          </li>
          <li
            class="option"
            :class="{ active: selectedTool === 'rectangle' }"
            id="rectangle"
            @click="selectTool('rectangle')"
          >
            <img src="../../icons/rectangle.svg" alt="rectangle" />
            <span>Rectangle</span>
          </li>
          <li
            class="option"
            :class="{ active: selectedTool === 'triangle' }"
            id="rectangle"
            @click="selectTool('triangle')"
          >
            <img src="../../icons/triangle.svg" alt="triangle" />
            <span>Triangle</span>
          </li>
          <li
            class="option"
            :class="{ active: selectedTool === 'star' }"
            id="star"
            @click="selectTool('star')"
          >
            <img src="../../icons/star.svg" alt="star" />
            <span>Star</span>
          </li>
          <li
            class="option"
            :class="{ active: selectedTool === 'line' }"
            id="line"
            @click="selectTool('line')"
          >
            <img src="../../icons/line.svg" alt="line" />
            <span>Line</span>
          </li>
          <li class="option">
            <input type="checkbox" id="fill-color" v-model="fillColor" @change="pickColor" />
            <label for="fill-color">Fill color</label>
          </li>
        </ul>
      </div>
      <div class="row">
        <label class="title">Options </label>
        <ul class="options">
          <li
            class="option"
            :class="{ active: selectedTool === 'brush' }"
            id="brush"
            @click="selectTool('brush')"
          >
            <img src="../../icons/brush.svg" alt="brush" />
            <span>Brush</span>
          </li>
          <li
            class="option"
            :class="{ active: selectedTool === 'eraser' }"
            id="eraser"
            @click="selectTool('eraser')"
          >
            <img src="../../icons/eraser.svg" alt="eraser" />
            <span>Eraser</span>
          </li>
          <li class="option option-size">
            <input type="range" id="size-slider" v-model="brushWidth" min="1" max="50" value="5" />
            <label for="size-slider">Size</label>
          </li>
        </ul>
      </div>
      <div class="row colors">
        <label class="title">Colors</label>
        <ul class="options options-colors">
          <li
            class="option"
            v-for="color in colors"
            :key="color"
            :style="{ background: color }"
            @click="selectColor(color)"
          ></li>
          <li class="option">
            <input type="color" id="color-picker" @change="pickColor" />
          </li>
        </ul>
      </div>

      <div class="row buttons">
        <li class="option">
          <button class="clear-canvas" @click="clearCanvas">Clear All</button>
        </li>
        <li class="option">
          <button class="save-img">Save As Image</button>
        </li>
        <li class="option">
          <button class="undo-canvas">Undo</button>
        </li>
      </div>
    </section>
    <canvas
      class="canvas"
      id="canvas"
      ref="canvas"
      width="740"
      height="500"
      @mousedown="startDraw"
      @mousemove="drawing"
      @mouseup="stopDraw"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const isDrawing = ref(false)
const prevMouseX = ref(0)
const prevMouseY = ref(0)
const snapshot = ref<ImageData | null>(null)
const selectedTool = ref('brush')
const brushWidth = ref(5)
const selectedColor = ref('#000')
const fillColor = ref(false)
const colors = ['#000', 'red', '#0f0', '#00f']

const setCanvasBackground = () => {
  if (ctx.value) {
    ctx.value.fillStyle = '#fff'
    ctx.value.fillRect(0, 0, canvas.value!.width, canvas.value!.height)
    ctx.value.fillStyle = selectedColor.value
  }
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth
    canvas.value.height = canvas.value.offsetHeight
    ctx.value = canvas.value.getContext('2d')
    setCanvasBackground()
  }

  window.addEventListener('mousemove', drawing)
  window.addEventListener('mouseup', stopDraw)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', drawing)
  window.removeEventListener('mouseup', stopDraw)
})

const selectColor = (color: string) => {
  console.log(color)
  selectedColor.value = color
}

const pickColor = (e: Event) => {
  const target = e.target as HTMLInputElement
  selectedColor.value = target.value
}

const selectTool = (tool: string) => {
  console.log(tool)
  selectedTool.value = tool
}

const startDraw = (e: MouseEvent) => {
  if (!ctx.value) return
  isDrawing.value = true
  prevMouseX.value = e.offsetX
  prevMouseY.value = e.offsetY
  ctx.value.beginPath()
  ctx.value.lineWidth = brushWidth.value
  ctx.value.strokeStyle = selectedColor.value
  ctx.value.fillStyle = selectedColor.value
  snapshot.value = ctx.value.getImageData(0, 0, canvas.value!.width, canvas.value!.height)
}

const drawing = (e: MouseEvent) => {
  if (!isDrawing.value || !ctx.value || !snapshot.value) return
  ctx.value?.putImageData(snapshot.value, 0, 0)
  ctx.value.strokeStyle = selectedTool.value === 'eraser' ? '#fff' : selectedColor.value
  const rect = canvas.value!.getBoundingClientRect()
  const currentX = e.clientX - rect.left
  const currentY = e.clientY - rect.top

  switch (selectedTool.value) {
    case 'eraser':
      ctx.value?.lineTo(currentX, currentY)
      ctx.value?.stroke()
      break
    case 'brush':
      ctx.value?.lineTo(currentX, currentY)
      ctx.value?.stroke()
      break
    case 'rectangle':
      drawRect(currentX, currentY)
      break
    case 'circle':
      drawCircle(currentX, currentY)
      break
    case 'triangle':
      drawTriangle(currentX, currentY)
      break
    case 'line':
      drawLine(currentX, currentY)
      break
    case 'star':
      drawStar(currentX, currentY)
      break
  }
}

const stopDraw = () => {
  isDrawing.value = false
}

const clearCanvas = () => {
  if (!ctx.value || !canvas.value) return
  ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  setCanvasBackground()
}

const drawStar = (currentX: number, currentY: number) => {
  if (!ctx.value) return
  const points = 7
  const outerRadius = Math.sqrt(
    Math.pow(prevMouseX.value - currentX, 2) + Math.pow(prevMouseY.value - currentY, 2)
  )
  const innerRadius = outerRadius / 2
  ctx.value.beginPath()
  for (let i = 0; i < points; i++) {
    const angle = (i * 2 * Math.PI) / points - Math.PI / 2
    const x = prevMouseX.value + Math.cos(angle) * outerRadius
    const y = prevMouseY.value + Math.sin(angle) * outerRadius
    ctx.value.lineTo(x, y)
    const nextAngle = ((i + 0.5) * 2 * Math.PI) / points - Math.PI / 2
    const innerX = prevMouseX.value + Math.cos(nextAngle) * innerRadius
    const innerY = prevMouseY.value + Math.sin(nextAngle) * innerRadius
    ctx.value.lineTo(innerX, innerY)
  }
  ctx.value.closePath()
  fillColor.value ? ctx.value.fill() : ctx.value.stroke()
}

const drawRect = (currentX: number, currentY: number) => {
  if (!ctx.value) return
  if (!fillColor.value) {
    ctx.value.strokeRect(
      prevMouseX.value,
      prevMouseY.value,
      currentX - prevMouseX.value,
      currentY - prevMouseY.value
    )
  } else {
    ctx.value.fillRect(
      prevMouseX.value,
      prevMouseY.value,
      currentX - prevMouseX.value,
      currentY - prevMouseY.value
    )
  }
}

const drawLine = (currentX: number, currentY: number) => {
  if (!ctx.value) return
  ctx.value.beginPath()
  ctx.value.moveTo(prevMouseX.value, prevMouseY.value)
  ctx.value.lineTo(currentX, currentY)
  ctx.value.stroke()
}

const drawCircle = (currentX: number, currentY: number) => {
  if (!ctx.value) return
  ctx.value.beginPath()
  const radius = Math.sqrt(
    Math.pow(prevMouseX.value - currentX, 2) + Math.pow(prevMouseY.value - currentY, 2)
  )
  // console.log(prevMouseX.value, prevMouseY.value)
  ctx.value.arc(prevMouseX.value, prevMouseY.value, radius, 0, 2 * Math.PI)
  fillColor.value ? ctx.value.fill() : ctx.value.stroke()
}

const drawTriangle = (currentX: number, currentY: number) => {
  if (!ctx.value) return
  ctx.value.beginPath()
  ctx.value.moveTo(prevMouseX.value, prevMouseY.value)
  ctx.value.lineTo(currentX, currentY)
  ctx.value.lineTo(prevMouseX.value * 2 - currentX, currentY)
  ctx.value.closePath()
  fillColor.value ? ctx.value.fill() : ctx.value.stroke()
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #4a98f7;
}
.container {
  display: flex;
  width: 100%;
  gap: 10px;
  max-width: 1050px;
}
section {
  background: #fff;
  border-radius: 7px;
}
.tools-board {
  width: 150px;
  margin-right: 30px;
}
.tools-board .row {
  margin-bottom: 20px;
}
.row .options {
  list-style: none;
  margin: 10px 0 0 5px;
}
.row .options .option {
  display: flex;
  cursor: pointer;
  align-items: center;
  margin-bottom: 10px;
}

.option:is(:hover, .active) :where(span, label) {
  color: #4a98f7;
  font-weight: 600;
}

.option #fill-color {
  cursor: pointer;
  height: 14px;
  width: 14px;
}
#fill-color:checked ~ label {
  color: #4a98f7;
}

.option #size-slider {
  width: 80px;
  height: 5px;
}
.option #size-slider:hover {
  cursor: pointer;
}

.colors .options {
  display: flex;
  justify-content: space-between;
}
.colors .option {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-top: 3px;
  position: relative;
}

.colors .option.selected::before {
  position: absolute;
  content: '';
  top: 50%;
  left: 50%;
  height: 12px;
  width: 12px;
  background: inherit;
  border-radius: inherit;
  border: 2px solid #fff;
  transform: translate(-50%, -50%);
}
.colors .option:first-child.selected::before {
  border-color: #ccc;
}
.option #color-picker {
  height: 20px;
  width: 20px;
  background-color: #ffffff;
  cursor: pointer;
}
.buttons button {
  width: 100%;
  color: #fff;
  border: none;
  outline: none;
  padding: 11px 0;
  font-size: 0.9rem;
  margin-bottom: 13px;
  background: none;
  border-radius: 4px;
  cursor: pointer;
}
.buttons .clear-canvas {
  color: #6c757d;
  border: 1px solid #6c757d;
  transition: all 0.3s ease;
}
.buttons .undo-canvas {
  background-color: #212122;
  color: #6c757d;
}

.clear-canvas:hover {
  color: #fff;
  background: #6c757d;
}
.buttons .save-img {
  background: #4a98f7;
  border: 1px solid #4a98f7;
}

.canvas {
  max-width: 740px;
  max-height: 500px;
  width: 100%;
  cursor: pointer;
}
.canvas {
  border: 1px solid grey;
  border-radius: 20px;
}

@media (min-width: 300px) and (max-width: 540px) {
  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .options {
    display: flex;
    gap: 20px;
    white-space: nowrap;
  }
  .options-colors {
    gap: 0px;
  }
  .option :where(span, label) {
    padding-left: 0px;
  }
  .title {
    display: none;
  }
  .row.buttons {
    display: flex;
    flex-wrap: nowrap;
    gap: 20px;
  }
  .buttons button {
    min-width: 100px;
    padding: 5px 10px;
  }
  .tools-board .row {
    margin-bottom: 10px;
  }
  .canvas {
    width: 100%;
    height: 350px;
  }
}
</style>
