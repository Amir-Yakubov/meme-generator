'use strict'

// canvas and events

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

function renderCanvas() {
    gCtx.fillStyle = 'rgb(225, 225, 225)'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function clearCanvas() {
    if (!confirm('Are you sure?')) return
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    clearPlaceHolder()
    renderCanvas()
    renderImg()
    resetLines()
}

function clearPlaceHolder() {
    const elTextInput = document.querySelector('.text-input')
    elTextInput.value = ""
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetWidth
}

function drawText(x, y, text) {
    renderCanvas()
    renderImg()

    let meme = getGMeme()
    let lines = getGMemeLines()

    //update the selected line with values
    const lineIdx = meme.seletedLineIdx
    lines[lineIdx].txt = text
    lines[lineIdx].location = { x, y }

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
    gCtx.strokeStyle = 'black'
    gCtx.strokeRect(x, y, rectSizeX, rectSizeY)
}

// user engagement

function onDown(ev) {
    const pos = getEvPos(ev)
    const lineIdx = getClickedLineIdx(pos)

    if (lineIdx === -1 || lineIdx === undefined) return
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

function getClickedLineIdx(clickedPos) {
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

// render

function showCanvas() {
    var elMemeEditor = document.querySelector('.meme-editor')
    elMemeEditor.style.display = 'flex'

    var elMemeEditor = document.querySelector('.search-Input')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.gallery')
    elMemeEditor.style.display = 'none'
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

function renderText() {
    const value = gMeme.lines[gMeme.seletedLineIdx].txt
    const x = gMeme.lines[gMeme.seletedLineIdx].location.x
    const y = gMeme.lines[gMeme.seletedLineIdx].location.y
    drawText(x, y, value)
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

// features - Meme editor

function onAddMemeTxt(value) {
    if (!value) return
    const x = 250
    let y = 50
    if (gMeme.lines.length === 2) y = 450
    if (gMeme.lines.length > 2) y = 250
    drawText(x, y, value)
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

function onChangeFontSize(plusOrMinus) {
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

function onChangeAlign(align) {
    const idx = gMeme.seletedLineIdx
    gMeme.lines[idx].align = align
    renderText()
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
            console.log('url:', url)
            onSuccess(url)
        })
}

function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
}

