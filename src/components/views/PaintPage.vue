<template>
  <button @click="$router.push('/')" type="button" class="back">
    <img src="../../icons/back.svg" alt="back" />
    <span>back</span>
  </button>
  <div class="container">
    <section class="tools-board">
      <div class="row">
        <label class="title">Shapes</label>
        <ul class="options">
          <li
            class="options__option"
            :class="{ active: selectedTool === 'circle' }"
            id="circle"
            @click="selectTool('circle')"
          >
            <img src="../../icons/circle.svg" alt="circle" />
            <span>Circle</span>
          </li>
          <li
            class="options__option"
            :class="{ active: selectedTool === 'rectangle' }"
            id="rectangle"
            @click="selectTool('rectangle')"
          >
            <img src="../../icons/rectangle.svg" alt="rectangle" />
            <span>Rectangle</span>
          </li>
          <li
            class="options__option"
            :class="{ active: selectedTool === 'triangle' }"
            id="rectangle"
            @click="selectTool('triangle')"
          >
            <img src="../../icons/triangle.svg" alt="triangle" />
            <span>Triangle</span>
          </li>
          <li
            class="options__option"
            :class="{ active: selectedTool === 'star' }"
            id="star"
            @click="selectTool('star')"
          >
            <img src="../../icons/star.svg" alt="star" />
            <span>Star</span>
          </li>
          <li
            class="options__option"
            :class="{ active: selectedTool === 'line' }"
            id="line"
            @click="selectTool('line')"
          >
            <img src="../../icons/line.svg" alt="line" />
            <span>Line</span>
          </li>
          <li class="options__option">
            <input type="checkbox" id="fill-color" v-model="fillColor" @change="pickColor" />
            <label for="fill-color">Fill color</label>
          </li>
        </ul>
      </div>
      <div class="row">
        <div class="row__inner">
          <label class="title">Options </label>
          <ul class="options">
            <li
              class="options__option"
              :class="{ active: selectedTool === 'brush' }"
              id="brush"
              @click="selectTool('brush')"
            >
              <img src="../../icons/brush.svg" alt="brush" />
              <span>Brush</span>
            </li>
            <li
              class="options__option"
              :class="{ active: selectedTool === 'eraser' }"
              id="eraser"
              @click="selectTool('eraser')"
            >
              <img src="../../icons/eraser.svg" alt="eraser" />
              <span>Eraser</span>
            </li>
            <li class="options__option options__option-size">
              <input
                type="range"
                id="size-slider"
                v-model="brushWidth"
                min="1"
                max="50"
                value="5"
              />
              <label for="size-slider">Size</label>
            </li>
          </ul>
        </div>
        <div class="row__inner colors">
          <label class="title">Colors</label>
          <ul class="options options-colors">
            <li
              class="options__option"
              v-for="color in colors"
              :key="color"
              :style="{ background: color }"
              @click="selectColor(color)"
            ></li>
            <li class="options__option">
              <input type="color" id="color-picker" @change="pickColor" />
            </li>
          </ul>
        </div>
      </div>

      <div class="row buttons">
        <li class="options__option">
          <button class="undo-canvas" @click="undo">
            <img src="../../icons/undo.svg" alt="line" />
            <p>Undo</p>
          </button>
        </li>
        <li class="options__option">
          <button class="clear-canvas" @click="clearCanvas">Clear All</button>
        </li>
        <li class="options__option">
          <button class="save-img" @click="handleSaveImage" :disabled="isUploading">
            Save As Image
          </button>
        </li>
      </div>
    </section>
    <canvas
      class="canvas"
      id="canvas"
      ref="canvas"
      @mousedown.prevent="startDraw"
      @mousemove.prevent="drawing"
      @mouseup.prevent="stopDraw"
      @touchstart.prevent="startDraw"
      @touchmove.prevent="drawing"
      @touchend.prevent="stopDraw"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { auth } from '../../firebase/config'
import type { IDataObj } from '@/models/models'
import { saveToDB } from '@/api/service'
import { useCanvasDrawing } from '@/composables/useDrawing'

const {
  canvas,
  selectedTool,
  brushWidth,
  selectedColor,
  fillColor,
  startDraw,
  drawing,
  stopDraw,
  clearCanvas,
  undo
} = useCanvasDrawing()

const userEmail = ref<string | null>('')
const isUploading = ref<boolean>(false)
const userId = ref<string | null>(null)
const colors: Array<string> = ['#000', 'red', '#0f0', '#00f']

const handleSaveImage = async () => {
  if (canvas.value) {
    const pictureObjActual: IDataObj = {
      userEmail: userEmail.value as string,
      date: new Date(),
      timestamp: new Date().getTime(),
      src: canvas.value.toDataURL()
    }
    await saveToDB(pictureObjActual)
  }
}

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      userEmail.value = user.email
      userId.value = user.uid
    }
  })
})

const selectColor = (color: string): void => {
  selectedColor.value = color
}

const pickColor = (e: Event): void => {
  const target = e.target as HTMLInputElement
  selectedColor.value = target.value
}

const selectTool = (tool: string): void => {
  selectedTool.value = tool
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  max-width: 720px;
  margin: 0 auto;
  margin-bottom: 30px;
}

.back {
  height: 25px;
  border: none;
  background-color: transparent;
  margin-bottom: 20px;
  margin-right: 20px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--color);
}

.tools-board {
  user-select: none;
  margin-left: 20px;
}

.row .options .options__option {
  display: flex;
  cursor: pointer;
  align-items: center;
  margin-bottom: 10px;
}

.options {
  display: flex;
  gap: 20px;
  white-space: nowrap;
}

.options__option #fill-color {
  cursor: pointer;
  height: 14px;
  width: 14px;
}
#fill-color:checked ~ label {
  color: var(--primary-color);
}

.options__option #size-slider:hover {
  cursor: pointer;
}
.title {
  display: none;
}

.colors .options {
  justify-content: flex-start;
  gap: 15px;
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
}
.options__option:is(:hover, .active) :where(span, label) {
  color: var(--primary-color);
  font-weight: 400;
}

.tools-board .row,
.row__inner {
  margin-bottom: 10px;
}

.colors .options__option {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-top: 3px;
  position: relative;
}

.options__option #color-picker {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.buttons button {
  width: 100%;
  color: var(--background-color);
  border: none;
  outline: none;
  padding: 11px 0;
  margin-bottom: 15px;
  background: none;
  border-radius: 4px;
  cursor: pointer;
}
.buttons .clear-canvas {
  color: var(--color);
  border: 1px solid var(--color-shade);
}
.buttons .undo-canvas {
  background-color: var(--color-shade);
  color: var(--background-color);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--color-shade);
}

.undo-canvas:hover {
  color: var(--color);
  background: var(--background-color);
}

.clear-canvas:hover {
  color: var(--background-color);
  background: var(--color-shade);
}

.buttons .save-img {
  background-color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.save-img:disabled {
  background-color: var(--color-shade);
  border: 1px solid var(--color-shade);
}

.save-img:hover {
  background-color: var(--primary-color-shade);
}

.canvas {
  max-width: 720px;
  aspect-ratio: 8 / 5;
  width: 100%;
  border: 1px solid var(--color-shade);
  border-radius: 20px;
  cursor: pointer;
}

@media (min-width: 550px) and (max-width: 740px) {
  .tools-board {
    width: 500px;
    margin: 0 auto;
  }
}

@media (min-width: 300px) and (max-width: 740px) {
  .options__option :where(span, label) {
    padding-left: 0px;
  }

  .buttons button {
    min-width: 100px;
  }

  #size-slider {
    width: 100px;
  }
  .options__option:is(:hover, .active) :where(span, label) {
    color: var(--primary-color);
    font-weight: 400;
  }

  .tools-board .row {
    margin-bottom: 10px;
  }
}
@media (min-width: 300px) and (max-width: 550px) {
  .options {
    width: 300px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .tools-board {
    margin: 0 auto;
  }
}
</style>
