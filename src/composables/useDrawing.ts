import { ref, onMounted, onUnmounted } from 'vue'

export function useCanvasDrawing() {
  const canvas = ref<HTMLCanvasElement | null>(null)
  const ctx = ref<CanvasRenderingContext2D | null>(null)
  const isDrawing = ref<boolean>(false)
  const prevMouseX = ref<number>(0)
  const prevMouseY = ref<number>(0)
  const snapshot = ref<ImageData | null>(null)
  const selectedTool = ref<string>('brush')
  const brushWidth = ref<number>(5)
  const selectedColor = ref<string>('#000')
  const fillColor = ref<boolean>(false)
  const history = ref<ImageData[]>([])

  const setCanvasBackground = () => {
    if (ctx.value) {
      ctx.value.fillStyle = '#fff'
      ctx.value.fillRect(0, 0, canvas.value!.width, canvas.value!.height)
      ctx.value.fillStyle = selectedColor.value
    }
  }

  const saveImageState = (): void => {
    if (ctx.value && canvas.value) {
      snapshot.value = ctx.value.getImageData(0, 0, canvas.value.width, canvas.value.height)
      history.value.push(snapshot.value)
    }
  }

  const getRelativePosition = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
    const rect = canvas.value!.getBoundingClientRect()
    const scaleX = canvas.value!.width / rect.width
    const scaleY = canvas.value!.height / rect.height
    if (event instanceof TouchEvent) {
      const touch = event.touches[0]
      const x = (touch.clientX - rect.left) * scaleX
      const y = (touch.clientY - rect.top) * scaleY
      return { x, y }
    } else {
      const x = (event.clientX - rect.left) * scaleX
      const y = (event.clientY - rect.top) * scaleY
      return { x, y }
    }
  }

  const startDraw = (e: MouseEvent | TouchEvent) => {
    if (!ctx.value) return
    isDrawing.value = true
    const pos = getRelativePosition(e)
    prevMouseX.value = pos.x
    prevMouseY.value = pos.y
    ctx.value.beginPath()
    ctx.value.lineWidth = brushWidth.value
    ctx.value.strokeStyle = selectedColor.value
    ctx.value.fillStyle = selectedColor.value
    saveImageState()
  }

  const drawing = (e: MouseEvent | TouchEvent): void => {
    if (!isDrawing.value || !ctx.value || !snapshot.value) return
    ctx.value?.putImageData(snapshot.value, 0, 0)
    ctx.value.strokeStyle = selectedTool.value === 'eraser' ? '#fff' : selectedColor.value
    const pos = getRelativePosition(e)
    const currentX = pos.x
    const currentY = pos.y

    switch (selectedTool.value) {
      case 'eraser':
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

  const stopDraw = (): void => {
    isDrawing.value = false
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

  const clearCanvas = (): void => {
    if (!ctx.value || !canvas.value) return
    saveImageState()
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    setCanvasBackground()
  }

  const undo = (): void => {
    if (history.value.length === 0 || !ctx.value) return
    const lastState = history.value.pop()
    if (lastState) {
      ctx.value.putImageData(lastState, 0, 0)
    } else {
      clearCanvas()
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
    canvas.value?.addEventListener('touchmove', drawing)
    canvas.value?.addEventListener('touchend', stopDraw)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', drawing)
    window.removeEventListener('mouseup', stopDraw)
    canvas.value?.removeEventListener('touchmove', drawing)
    canvas.value?.removeEventListener('touchend', stopDraw)
  })

  return {
    canvas,
    ctx,
    selectedTool,
    brushWidth,
    selectedColor,
    fillColor,
    startDraw,
    drawing,
    stopDraw,
    clearCanvas,
    undo
  }
}
