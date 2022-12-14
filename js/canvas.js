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
            txt: 'I sometimes eat Falafel',
            size: 50,
            font: 'impact',
            align: 'left',
            bgColor: 'white',
            strokeColor: 'black'
        }
    ]
}

function onInitCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
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
    console.log(img)
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderImgGallery(src, id) {
    id = +id
    const imgIdx = findImgIdxById(id)
    gMeme.selectedImgId = id
    gMeme.seletedImgIdx = imgIdx
    gImgs[imgIdx].url = src

    renderImg()
}

function renderImg() {
    const src = gImgs[gMeme.seletedImgIdx].url
    console.log(src)
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

function drawText(x, y, text) {
    renderCanvas()
    renderImg()

    gCtx.lineWidth = '1'
    gCtx.strokeStyle = `${gMeme.lines[0].strokeColor}`
    gCtx.fillStyle = `${gMeme.lines[0].bgColor}`
    gCtx.font = `${gMeme.lines[0].size}px ${gMeme.lines[0].font}`;
    gCtx.textAlign = gMeme.lines[0].align
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function setColor(bgColor, strokColor) {
    gCurrPref.bgColor = bgColor
    gCurrPref.strokColor = strokColor
}

function clearCanvas() {
    if (!confirm('Are you sure?')) return
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    renderCanvas()
}

function onAddMemeTxt(value) {
    // const x = 100
    // const y = 100
    
    drawText(x, y, value)
}

function onSearch(value) { // TODO
    console.log(value)
}