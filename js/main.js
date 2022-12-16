'use strict'

// features - gallery

function onInit() {
    onInitCanvas()
    renderGallery()
}

function renderGallery() {
    let strHtml = `
    <label for="img-upload" class="item img-upload">Custom Upload
    <input type="file" id="img-upload" name="image" onchange="onImgInput(event)" /></label>`

    const imgs = getGImgs()
    imgs.forEach(img => {
        const src = img.url
        const id = img.id
        strHtml += `<img id="${id}" src="${src}" class="item" onclick="showCanvas(), renderImgGallery(src, id)" />`
    })
    document.querySelector('.main-gallery').innerHTML = strHtml
}

function onSearch(value) { // TODO
    console.log(value)
}

function onImgInput(ev) {
    showCanvas()
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()
    reader.onload = (event) => {
        let img = new Image()
        img.src = event.target.result
        const newImg = { id: gImgs.length + 1, url: img.src }
        gImgs.push(newImg)
        gMeme.selectedImgId = newImg.id
        gMeme.seletedImgIdx = newImg.id - 1
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])

}

// features - saved Memes

function showSavedMemes() {
    var elMemeEditor = document.querySelector('.meme-editor')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.search-Input')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.img-input')
    elMemeEditor.style.display = 'none'

    var elMemeEditor = document.querySelector('.main-gallery')
    elMemeEditor.style.display = 'none'

    renderSavedMemes()
}

function renderSavedMemes() {
    let strHtml = ''
    const savedMemes = loadFromStorage(STORAGE_MEMES_KEY)
    savedMemes.forEach(savedMeme => {
        strHtml += `
        <img class="saved-item" src="${savedMeme.url}" />`
    })

    document.querySelector('.saved-memes').innerHTML = strHtml
}

