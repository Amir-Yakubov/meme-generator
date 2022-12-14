'use strict'

let gCurrPref
let gElCanvas
let gCtx

var gKeywordSearchCountMap = { 'funny': 12, 'cat': 16 }

var gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'tramp'] },
    { id: 2, url: 'img/2.jpg', keywords: ['cute', 'dogs'] },
    { id: 3, url: 'img/3.jpg', keywords: ['funny', 'baby', 'dogs'] }
]

var gMeme = {
    selectedImgId: 1,
    seletedImgIdx: 0,
    lines: [
        {
            txt: '',
            size: 50,
            font: 'impact',
            align: 'left',
            bgColor: 'white',
            strokeColor: 'black',
            location: { x: 50, y: 50 }
        }
    ]
}



function onInitCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // resizeCanvas()
    // addListeners()
    renderCanvas()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
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

function renderImg(img) {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderImgGallery(src, id) {
    id = +id
    const imgIdx = findImgIdxById(id)
    gMeme.selectedImgId = id
    gMeme.seletedImgIdx = imgIdx
    gImgs[imgIdx].url = src
    // showCanvas()
    renderImg()
}

function renderImg() {
    const src = gImgs[gMeme.seletedImgIdx].url
    const img = new Image()
    img.src = src
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
}

function drawText(x = -1, y = -1, text = '') {
    renderCanvas()
    renderImg()

    if (x >= 0 || y >= 0) {
        const lineIdx = gMeme.lines.length - 1
        gMeme.lines[lineIdx].txt = text
        gMeme.lines[lineIdx].location = { x, y }
    }

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
}

function onAddMemeTxt(value) {
    let x = 50
    let y = 50
    if (gMeme.lines.length === 2) y = 450
    if (gMeme.lines.length === 3) y = 250

    drawText(x, y, value)
}

function onSearch(value) { // TODO
    console.log(value)
}

function renderText() {
    const elTextInput = document.querySelector('.text-input')
    const value = elTextInput.value

    onAddMemeTxt(value)
}

function onChangeStrokeColor(color) {
    const idx = gMeme.lines.length - 1
    gMeme.lines[idx].strokeColor = color
    renderText()
}

function onChangeBgColor(color) {
    const idx = gMeme.lines.length - 1
    gMeme.lines[idx].bgColor = color
    renderText()
}

function onChangeFont(font) {
    const idx = gMeme.lines.length - 1
    gMeme.lines[idx].font = font
    renderText()
}

function changeFontSize(plusOrMinus) {
    const idx = gMeme.lines.length - 1
    if (plusOrMinus === '+') gMeme.lines[idx].size += 3
    else gMeme.lines[idx].size -= 3
    renderText()
}

function onTextDone() {
    if (gMeme.lines.length === 3) {
        alert('We support up to 3 lines in MEME')
        return
    }
    const x = 50
    let y = 50

    if (gMeme.lines.length === 2) y = 450
    if (gMeme.lines.length === 3) y = 250

    const newLine = {
        txt: '',
        size: 50,
        font: 'impact',
        align: 'left',
        bgColor: 'white',
        strokeColor: 'black',
        location: { x, y }
    }
    gMeme.lines.push(newLine)
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ""
}
