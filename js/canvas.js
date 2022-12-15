'use strict'

let gCurrPref
let gElCanvas
let gStartPos
let gCtx

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16 }

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'tramp'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dogs'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'babys', 'dogs'] },
    { id: 4, url: 'img/4.jpg', keywords: ['cute', 'cats'] },
    { id: 5, url: 'img/5.jpg', keywords: ['babys', 'yes', 'funny'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny', 'history chanel'] },
    { id: 7, url: 'img/7.jpg', keywords: ['babys', 'funny'] },
    { id: 8, url: 'img/8.jpg', keywords: ['magician', 'purple'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny', 'babys'] }
]

var gMeme = {
    selectedImgId: 1,
    seletedImgIdx: 0,
    seletedLineIdx: 0,
    lines: [
        {
            txt: '',
            size: 50,
            font: 'impact',
            align: 'center',
            bgColor: 'white',
            strokeColor: 'black',
            location: { x: 50, y: 50 },
            isDrag: false
        }
    ]
}

function onInitCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderCanvas()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()

    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
        renderImg()
    })
}

function addMouseListeners() {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function isLineClicked(clickedPos) {
    const lineIdx = gMeme.lines.findIndex(line => {
        const { x, y } = line.location
        if (clickedPos.y > (y + line.size / 2) || clickedPos.y < (y - line.size / 2)) return
        if ((clickedPos.x < (x + line.size * 3) && clickedPos.x > (x - line.size * 3))) return line
    })
    if (lineIdx === -1) return
    gMeme.seletedLineIdx = lineIdx
    const wordLenght = gMeme.lines[lineIdx].txt.length
    const wordSize = gMeme.lines[lineIdx].size

    const rectStartX = gMeme.lines[lineIdx].location.x - (wordLenght * 40 / 2)
    const rectStartY = gMeme.lines[lineIdx].location.y - (wordSize)
    const rectSizeX = wordLenght * 40
    const rectSizeY = 80

    drawRect(rectStartX, rectStartY, rectSizeX, rectSizeY)
    return lineIdx
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        console.log('ev:', ev)
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const lineIdx = isLineClicked(pos)
    if (lineIdx === -1) return
    gMeme.lines[lineIdx].isDrag = true
    gMeme.lines[lineIdx].location.x = pos.x
    gMeme.lines[lineIdx].location.y = pos.y
    gMeme.seletedLineIdx = lineIdx
    document.body.style.cursor = 'grabbing'
    gStartPos = pos

}

function onMove(ev) {
    const { isDrag } = gMeme.lines[gMeme.seletedLineIdx]
    if (!isDrag) return

    const pos = getEvPos(ev)

    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    gStartPos = pos

    gMeme.lines[gMeme.seletedLineIdx].location.x += dx
    gMeme.lines[gMeme.seletedLineIdx].location.y += dy

    const txt = gMeme.lines[gMeme.seletedLineIdx].txt
    const x = gMeme.lines[gMeme.seletedLineIdx].location.x
    const y = gMeme.lines[gMeme.seletedLineIdx].location.y

    drawText(x, y, txt)
    const wordLenght = txt.length
    const wordSize = gMeme.lines[gMeme.seletedLineIdx].size

    const rectStartX = x - (wordLenght * 40 / 2)
    const rectStartY = y - (wordSize)
    const rectSizeX = wordLenght * 40
    const rectSizeY = 80
    drawRect(rectStartX, rectStartY, rectSizeX, rectSizeY)
}

function onUp() {
    gMeme.lines[gMeme.seletedLineIdx].isDrag = false
    document.body.style.cursor = 'grab'
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
}

function renderCanvas() {
    gCtx.fillStyle = 'rgb(225, 225, 225)'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = (event) => {
        let img = new Image()
        img.src = event.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImgGallery(src, id) {
    id = +id
    gMeme.selectedImgId = id

    const imgIdx = findImgIdxById(id)
    gMeme.seletedImgIdx = imgIdx
    gImgs[imgIdx].url = src
    renderImg()
}

function renderImg() {
    const src = gImgs[gMeme.seletedImgIdx].url
    const img = new Image()
    img.src = src
    resizeCanvas()
    renderCanvas()
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function findImgById(id) {
    const imgObj = gImgs.find(image => id === image.id)
    return imgObj.url
}

function findImgIdxById(id) {
    const imgObjIdx = gImgs.findIndex(image => id === image.id)
    return imgObjIdx
}

function showCanvas() {

    var elMemeEditor = document.querySelector('.meme-editor')
    elMemeEditor.style.display = 'flex'

    var elMemeEditor = document.querySelector('.search-Input')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.img-input')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.gallery')
    elMemeEditor.style.display = 'none'

    renderImg()
}

function drawText(x, y, text) {
    renderCanvas()
    renderImg()

    const lineIdx = gMeme.seletedLineIdx
    gMeme.lines[lineIdx].txt = text
    gMeme.lines[lineIdx].location = { x, y }

    gMeme.lines.forEach(line => {
        text = line.txt
        gCtx.strokeStyle = `${line.strokeColor}`
        gCtx.fillStyle = `${line.bgColor}`
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.textAlign = line.align

        gCtx.fillText(text, line.location.x, line.location.y)
        gCtx.strokeText(text, line.location.x, line.location.y)
    })

}

function clearCanvas() {
    if (!confirm('Are you sure?')) return
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderCanvas()
    renderImg()
    const elTextInput = document.querySelector('.text-input')
    console.log(elTextInput)
    elTextInput.value = ""
    resetLines()
}

function resetLines() {
    gMeme.lines = [
        {
            txt: '',
            size: 50,
            font: 'impact',
            align: 'center',
            bgColor: 'white',
            strokeColor: 'black',
            location: { x: 250, y: 50 },
            isDrag: false
        }
    ]
}

function onAddMemeTxt(value) {
    if (!value) return
    const x = 250
    let y = 50
    if (gMeme.lines.length === 2) y = 450
    if (gMeme.lines.length > 2) y = 250

    drawText(x, y, value)
}

function renderText() {
    const value = gMeme.lines[gMeme.seletedLineIdx].txt
    const x = gMeme.lines[gMeme.seletedLineIdx].location.x
    const y = gMeme.lines[gMeme.seletedLineIdx].location.y
    drawText(x, y, value)
}

// features

function onSearch(value) { // TODO
    console.log(value)
}

function onChangeStrokeColor(color) {
    const idx = gMeme.seletedLineIdx
    gMeme.lines[idx].strokeColor = color
    renderText()
}

function onChangeBgColor(color) {
    const idx = gMeme.seletedLineIdx
    gMeme.lines[idx].bgColor = color
    renderText()
}

function onChangeFont(font) {
    const idx = gMeme.seletedLineIdx
    gMeme.lines[idx].font = font
    renderText()
}

function onAlignChange(align) {
    const idx = gMeme.seletedLineIdx
    gMeme.lines[idx].align = align
    renderText()
}

function changeFontSize(plusOrMinus) {
    const idx = gMeme.seletedLineIdx
    if (plusOrMinus === '+') gMeme.lines[idx].size += 3
    else gMeme.lines[idx].size -= 3
    renderText()
}

function onMoveText(upOrDown) {
    const idx = gMeme.seletedLineIdx
    if (upOrDown === 'up') gMeme.lines[idx].location.y -= 50
    else gMeme.lines[idx].location.y += 50
    const value = gMeme.lines[idx].txt
    drawText(gMeme.lines[idx].location.x, gMeme.lines[idx].location.y, value)
}

function onChoseAnotherLine() {
    gMeme.seletedLineIdx += 1
    if (gMeme.seletedLineIdx > (gMeme.lines.length - 1)) gMeme.seletedLineIdx = 0

    const txt = gMeme.lines[gMeme.seletedLineIdx].txt
    if (txt === '') return

    const wordLenght = txt.length
    const wordSize = gMeme.lines[gMeme.seletedLineIdx].size
    const x = gMeme.lines[gMeme.seletedLineIdx].location.x
    const y = gMeme.lines[gMeme.seletedLineIdx].location.y

    const rectStartX = x - (wordLenght * 40 / 2)
    const rectStartY = y - (wordSize)
    const rectSizeX = wordLenght * 40
    const rectSizeY = 80

    renderCanvas()
    renderImg()
    renderText()
    drawRect(rectStartX, rectStartY, rectSizeX, rectSizeY)
}


function onTextDone() {
    const x = gMeme.lines[gMeme.seletedLineIdx].location.x
    const y = gMeme.lines[gMeme.seletedLineIdx].location.y

    const newLine = {
        txt: '',
        size: 50,
        font: 'impact',
        align: 'center',
        bgColor: 'white',
        strokeColor: 'black',
        location: { x, y },
        isDrag: false
    }
    gMeme.lines.push(newLine)
    gMeme.seletedLineIdx += 1
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ""
}

function drawRect(x, y, rectSizeX, rectSizeY) {
    gCtx.beginPath()

    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(x, y, rectSizeX, rectSizeY)
}