'use strict'

// features - gallery

function onInit() {
    onInitSearch()
    onInitCanvas()
    renderGallery()
    renderHashtags()
}

function renderGallery(imgs = getGImgs()) {
    let strHtml = `
    <label for="img-upload" class="item img-upload">Custom Upload
    <input type="file" id="img-upload" name="image" onchange="onImgInput(event)" /></label>`

    imgs.forEach(img => {
        const src = img.url
        const id = img.id
        strHtml += `<img id="${id}" src="${src}" class="item" onclick="showCanvas(), renderImgGallery(src, id)" />`
    })
    document.querySelector('.main-gallery').innerHTML = strHtml
}

function renderHashtags() {
    const keywords = getMemesKeywords()
    const keysCountMap = getGKeywordSearchCountMap()

    let fontSize = 16
    let strHtml = `<li class="tag" onclick="onSearchByHashtag('clear')">clear</li>`

    keywords.forEach(keyWord => {
        if (keysCountMap[keyWord] < 3 || !keysCountMap[keyWord]) return
        fontSize += (keysCountMap[keyWord] * 2)
        strHtml += `
        <li class="tag" style="font-size:${fontSize}px;" onclick="onSearchByHashtag('${keyWord}')">${keyWord}</li>
        `
        fontSize = 16
    })
    document.querySelector('.hashtag').innerHTML = strHtml
}

function filterImgsByKewword(key) {
    const imgs = getGImgs()
    const filteredImgs = imgs.filter(img => {
        const res = img.keywords.includes(key)
        if (res === true) return img
    })
    return filteredImgs
}

function onInitSearch() {
    const searchWrapper = document.querySelector('.search-input')
    const inputBox = document.querySelector('.input-search')
    const suggBox = document.querySelector('.autocom-box')

    inputBox.onkeyup = (e) => {
        let userData = e.target.value
        let emptyArray = []
        if (userData) {
            emptyArray = gKeyWords.filter(data => {
                return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase())
            })
            emptyArray = emptyArray.map(data => { return data = `<li>${data}</li>` })
            searchWrapper.classList.add('active')
            showSuggestions(emptyArray)
            let allList = suggBox.querySelectorAll('li')
            allList.forEach(li => {
                li.setAttribute("onclick", "select(this)")
            })
        } else {
            searchWrapper.classList.remove('active')
        }
    }
}

function select(element) {
    const inputBox = document.querySelector('.input-search')
    let selectUserData = element.textContent
    if (selectUserData === '') return renderGallery()
    updateKeywordCountMap(selectUserData)
    const filteredImges = filterImgsByKewword(selectUserData)
    renderGallery(filteredImges)
    inputBox.value = selectUserData
}

function updateKeywordCountMap(searchedKeys) {
    const keywordSearchCountMap = getGKeywordSearchCountMap()
    if (!keywordSearchCountMap[searchedKeys]) keywordSearchCountMap[searchedKeys] = 0
    keywordSearchCountMap[searchedKeys] += 1
    renderHashtags()
}

function onSearchByIcon() {
    const inputBox = document.querySelector('.input-search')
    updateKeywordCountMap(inputBox.value)
    const filteredImges = filterImgsByKewword(inputBox.value)
    renderGallery(filteredImges)
}

function onSearchByHashtag(key) {
    const inputBox = document.querySelector('.input-search')
    if (key === 'clear') {
        inputBox.value = ''
        return renderGallery()
    }
    updateKeywordCountMap(key)
    const filteredImges = filterImgsByKewword(key)
    renderGallery(filteredImges)
    inputBox.value = key
}

function onEmptySearchBar() {
    const inputBox = document.querySelector('.input-search')
    const key = inputBox.value
    if (key === '') renderGallery()
}

function showSuggestions(list) {
    const suggBox = document.querySelector('.autocom-box')
    const inputBox = document.querySelector('.input-search')
    let listData
    if (!list.length) {
        let userValue = inputBox.value
        listData = `<li>${userValue}</li>`
    } else {
        listData = list.join('')
    }
    suggBox.innerHTML = listData
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


