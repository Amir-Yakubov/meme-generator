'use strict'

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
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

function onInitCanvas() {
    // var elMemeEditor = document.querySelector('.meme-editor')
    // elMemeEditor.style.display = 'flex'

    // var elMemeEditor = document.querySelector('.search-Input')
    // elMemeEditor.style.display = 'none'

    // var elMemeEditor = document.querySelector('.gallery')
    // elMemeEditor.style.display = 'none'


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
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}