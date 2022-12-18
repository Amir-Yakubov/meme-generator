'use strict'

// init canvas and resize

function onInitCanvas() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    addListeners()
    renderCanvas()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
}

// events on canvas

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

// draw on canvas

function drawText(x = -1, y = -1, text = '') {
    renderCanvas()
    renderImg()

    let meme = getGMeme()
    let lines = getGMemeLines()

    if (y > 0) {
        //update the selected line with values
        const lineIdx = meme.seletedLineIdx
        lines[lineIdx].txt = text
        lines[lineIdx].location = { x, y }
    }

    //draw saved lines
    lines.forEach(line => {
        text = line.txt
        gCtx.strokeStyle = `${line.strokeColor}`
        gCtx.fillStyle = `${line.bgColor}`
        gCtx.font = `${line.size}px ${line.font}`
        gCtx.textAlign = line.align

        gCtx.fillText(text, line.location.x, line.location.y)
        gCtx.strokeText(text, line.location.x, line.location.y)
    })
}

function drawRect(x, y, rectSizeX, rectSizeY) {
    gCtx.strokeStyle = 'white'
    gCtx.strokeRect(x, y, rectSizeX, rectSizeY)
}

function drawSticker(sticker) {
    onTextDone(sticker)
    drawText(250, 250, sticker)
}

// user engagement

function onDown(ev) {
    const pos = getEvPos(ev)
    const lineIdx = getClickedLineIdx(pos)
    if (lineIdx === -1 || lineIdx === undefined) {
        drawText()
        return
    }
    let meme = getGMeme()
    if (meme.lines[lineIdx].txt === '') return

    drawText()
    drawFrame()

    meme.seletedLineIdx = lineIdx
    document.querySelector('.editor-row.text-input').value = meme.lines[lineIdx].txt
    document.body.style.cursor = 'grabbing'

    meme.lines[lineIdx].isDrag = true
    meme.lines[lineIdx].location.x = pos.x
    meme.lines[lineIdx].location.y = pos.y
    meme.seletedLineIdx = lineIdx
    gStartPos = pos
}

function onMove(ev) {
    let meme = getGMeme()
    const isDrag = meme.lines[gMeme.seletedLineIdx].isDrag
    if (!isDrag) return

    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    gStartPos = pos

    meme.lines[gMeme.seletedLineIdx].location.x += dx
    meme.lines[gMeme.seletedLineIdx].location.y += dy

    const txt = meme.lines[gMeme.seletedLineIdx].txt
    const x = meme.lines[gMeme.seletedLineIdx].location.x
    const y = meme.lines[gMeme.seletedLineIdx].location.y

    drawText(x, y, txt)
    drawFrame()
}

function onUp() {
    let meme = getGMeme()
    meme.lines[gMeme.seletedLineIdx].isDrag = false
    document.body.style.cursor = 'pointer'
}

function getClickedLineIdx(clickedPos) {
    let meme = getGMeme()
    const lineIdx = meme.lines.findIndex(line => {
        const { x, y } = line.location
        if (clickedPos.y > (y + line.size / 2) || clickedPos.y < (y - line.size / 2)) return
        if ((clickedPos.x < (x + line.size * 3) && clickedPos.x > (x - line.size * 3))) return line
        return -1
    })
    if (lineIdx === -1 || lineIdx === undefined) return
    meme.seletedLineIdx = lineIdx

    drawFrame()
    return lineIdx
}

// render

function renderCanvas() {
    gCtx.fillStyle = 'rgb(225, 225, 225)'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function clearCanvas() {
    if (!confirm('Are you sure?')) return

    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    let meme = getGMeme()
    meme.seletedLineIdx = 0

    clearPlaceHolder()
    renderCanvas()
    renderImg()
    resetLines()
    drawText()
}

function clearPlaceHolder() {
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ""
}

function renderSelectedImgToEditor(src, id) {
    id = +id
    let meme = getGMeme()
    meme.selectedImgId = id

    const imgIdx = findImgIdxById(id)
    meme.seletedImgIdx = imgIdx
    const imgs = getGImgs()
    imgs[imgIdx].url = src

    renderImg()
    drawText()
    document.querySelector('.editor-row.text-input').value = meme.lines[gMeme.seletedLineIdx].txt
}

function renderImg() {
    const src = gImgs[gMeme.seletedImgIdx].url
    const img = new Image()
    img.src = src
    resizeCanvas()
    renderCanvas()
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}

function renderText() {
    let meme = getGMeme()
    const value = meme.lines[gMeme.seletedLineIdx].txt
    const x = meme.lines[gMeme.seletedLineIdx].location.x
    const y = meme.lines[gMeme.seletedLineIdx].location.y
    drawText(x, y, value)
}

function resetLines() {
    let meme = getGMeme()
    meme.lines = [
        {
            txt: 'text here',
            size: 40,
            font: 'impact',
            align: 'center',
            bgColor: 'white',
            strokeColor: 'black',
            location: { x: 120, y: 100 },
            isDrag: false
        }
    ]
}

function showCanvas() {
    document.querySelector('.gallery-page').style.display = 'none'
    document.querySelector('.memes-page').style.display = 'none'
    document.querySelector('.about-page').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'flex'
}

// features - Meme editor

function onAddMemeTxt(value) {
    let meme = getGMeme()

    const x = meme.lines[meme.seletedLineIdx].location.x
    const y = meme.lines[meme.seletedLineIdx].location.y

    drawText(x, y, value)
    document.querySelector('.canvas-container').style.cursor = 'pointer'
}

function onChangeStrokeColor(color) {
    let meme = getGMeme()
    const idx = meme.seletedLineIdx
    meme.lines[idx].strokeColor = color
    drawText()
}

function onChangeBgColor(color) {
    let meme = getGMeme()
    const idx = meme.seletedLineIdx
    meme.lines[idx].bgColor = color
    drawText()
}

function onChangeFont(font) {
    let meme = getGMeme()
    const idx = meme.seletedLineIdx
    meme.lines[idx].font = font
    drawText()
}

function onChangeFontSize(plusOrMinus) {
    let meme = getGMeme()
    if (plusOrMinus === '+') meme.lines[meme.seletedLineIdx].size += 3
    else meme.lines[meme.seletedLineIdx].size -= 3
    drawText()
}

function onMoveText(upOrDown) {
    let meme = getGMeme()
    const idx = meme.seletedLineIdx
    if (upOrDown === 'up') meme.lines[idx].location.y -= 50
    else meme.lines[idx].location.y += 50
    const value = meme.lines[idx].txt
    drawText(meme.lines[idx].location.x, meme.lines[idx].location.y, value)
}

function onChangeAlign(align) {
    let meme = getGMeme()
    const idx = meme.seletedLineIdx
    meme.lines[idx].align = align
    drawText()
}

function onChoseAnotherLine() {
    let meme = getGMeme()
    meme.seletedLineIdx += 1
    if (meme.seletedLineIdx > (meme.lines.length - 1)) meme.seletedLineIdx = 0

    const txt = meme.lines[meme.seletedLineIdx].txt
    if (txt === '') return

    document.querySelector('.editor-row.text-input').value = meme.lines[meme.seletedLineIdx].txt
    renderCanvas()
    renderImg()
    drawText()
    drawFrame()
}

function drawFrame() {
    let meme = getGMeme()
    const txt = meme.lines[meme.seletedLineIdx].txt
    const wordLenght = txt.length
    const wordSize = meme.lines[meme.seletedLineIdx].size
    const x = meme.lines[meme.seletedLineIdx].location.x
    const y = meme.lines[meme.seletedLineIdx].location.y

    const rectStartX = x - (wordLenght * wordSize * 0.35)
    const rectStartY = y - (wordSize * 1.3)
    const rectSizeX = wordLenght * wordSize * 0.7
    const rectSizeY = wordSize * 2
    drawRect(rectStartX, rectStartY, rectSizeX, rectSizeY)
}

function onTextDone() {
    let meme = getGMeme()
    const x = 120
    let y = 100
    if (meme.lines.length > 0) y = 150
    if (meme.lines.length > 1) y = 200
    if (meme.lines.length > 2) y = 250

    const newLine = {
        txt: 'new line',
        size: 40,
        font: 'impact',
        align: 'center',
        bgColor: 'white',
        strokeColor: 'black',
        location: { x, y },
        isDrag: false
    }
    meme.lines.push(newLine)
    meme.seletedLineIdx += 1
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ""
    drawText()
}

function downloadCanvas(elLink) {
    const data = gElCanvas.toDataURL()
    elLink.href = data
}

function onShareFacebook() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')
    doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {

    const formData = new FormData()
    formData.append('img', imgDataUrl)

    fetch('//ca-upload.com/here/upload.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(url => {
            onSuccess(url)
        })
}

function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
}

// sticker slider

var slideIndex = 1
showSlides(slideIndex)

function plusSlides(n) {
    showSlides(slideIndex += n)
}

function currentSlide(n) {
    showSlides(slideIndex = n)
}

function showSlides(n) {
    let i
    var slides = document.getElementsByClassName("mySlides")
    var dots = document.getElementsByClassName("dot")

    if (n > slides.length) { slideIndex = 1 }

    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none"
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "")
    }

    slides[slideIndex - 1].style.display = "block"
    dots[slideIndex - 1].className += " active"
}

