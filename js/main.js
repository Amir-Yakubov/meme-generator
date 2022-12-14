'use strict'

// features - gallery

function onInit() {
    onInitSearch()
    onInitCanvas()
    renderGallery()
    renderHashtags()
}

function showGalleryPage() {
    document.querySelector('.memes-page').style.display = 'none'
    document.querySelector('.about-page').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.gallery-page').style.display = 'block'
}

function renderGallery(imgs = getGImgs()) {
    let strHtml = `
    <label for="img-upload" class="item img-upload">Upload img
    <input type="file" id="img-upload" name="image" onchange="onImgInput(event)" /></label>`

    imgs.forEach(img => {
        const src = img.url
        const id = img.id
        strHtml += `<img id="${id}" src="${src}" class="item" onclick="showCanvas(), renderSelectedImgToEditor(src, id)" />`
    })
    document.querySelector('.main-gallery').innerHTML = strHtml
}

function renderHashtags() {
    const keywords = getMemesKeywords()
    const keysCountMap = getGKeywordSearchCountMap()

    let fontSize = 16
    let strHtml = ``

    keywords.forEach(keyWord => {
        if (keysCountMap[keyWord] < 3 || !keysCountMap[keyWord]) return
        fontSize += (keysCountMap[keyWord] * 2)
        strHtml += `
        <li class="tag" style="font-size:${fontSize}px;" onclick="onSearchByHashtag('${keyWord}')">${keyWord}</li>
        `
        fontSize = 16
    })
    strHtml += `
    <li class="tag more-tag" onclick="onOpenMoreHashtag()">More</li>`

    document.querySelector('.hashtag').innerHTML = strHtml
}

function onOpenMoreHashtag() {
    const keywords = getMemesKeywords()
    const keysCountMap = getGKeywordSearchCountMap()
    let strHtml = ``
    let fontSize = 16

    keywords.forEach(keyWord => {
        if (keysCountMap[keyWord] > 2) return
        if (!keysCountMap[keyWord]) keysCountMap[keyWord] = 0
        fontSize += (keysCountMap[keyWord] * 2)
        strHtml += `
        <li class="tag" style="font-size:${fontSize}px;" onclick="onSearchByHashtag('${keyWord}')">${keyWord}</li>
        `
        fontSize = 16
    })
    strHtml += `<li class="tag hide-tag" onclick="onHideMoreHashtag()">Hide</li>`
    document.querySelector('.more-hashtag').style.display = 'flex'
    document.querySelector('.more-hashtag').innerHTML = strHtml
    document.querySelector('.more-tag').style.display = 'none'
}

function onHideMoreHashtag() {
    document.querySelector('.more-hashtag').style.display = 'none'
    document.querySelector('.more-tag').style.display = 'inline-block'
}

function filterImgsByKewword(key) {
    const imgs = getGImgs()
    const filteredImgs = imgs.filter(img => {
        const res = img.keywords.includes(key)
        if (res === true) return img
    })
    return filteredImgs
}

/// search bar

function onInitSearch() {
    const searchWrapper = document.querySelector('.search-input')
    const searchInputBox = document.querySelector('.input-search')
    const suggestionBox = document.querySelector('.autocom-box')

    searchInputBox.onkeyup = (e) => {
        let inputKeywords = e.target.value
        let searchSuggestion = []

        if (inputKeywords) {
            searchSuggestion = gKeyWords.filter(data => {
                return data.toLocaleLowerCase().startsWith(inputKeywords.toLocaleLowerCase())
            })

            searchSuggestion = searchSuggestion.map(data => { return data = `<li>${data}</li>` })

            searchWrapper.classList.add('active')
            showSuggestions(searchSuggestion)

            let allList = suggestionBox.querySelectorAll('li')

            allList.forEach(li => {
                li.setAttribute("onclick", "onSelectSuggestion(this)")
            })
        } else {
            searchWrapper.classList.remove('active')
        }
    }
}

function onSelectSuggestion(element) {
    const inputBox = document.querySelector('.input-search')
    let selectedSuggestion = element.textContent
    if (selectedSuggestion === '') return renderGallery()
    updateKeywordCountMap(selectedSuggestion)
    const filteredImges = filterImgsByKewword(selectedSuggestion)
    renderGallery(filteredImges)
    inputBox.value = selectedSuggestion
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
    updateKeywordCountMap(key)
    const filteredImges = filterImgsByKewword(key)
    renderGallery(filteredImges)
    inputBox.value = key
}

function clearSelectedHashtag() {
    const inputBox = document.querySelector('.input-search')
    inputBox.value = ''
    return renderGallery()
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

// upload img

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
    document.querySelector('.about-page').style.display = 'none'
    document.querySelector('.gallery-page').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.memes-page').style.display = 'block'
    document.querySelector('.saved-memes').style.display = 'grid'
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

// nav and modal

function onToggleMenu() {
    document.body.classList.toggle('menu-open')
}

function onToggleModal() {
    document.body.classList.toggle('modal-open')
}

// about-page

function showAboutPage() {
    document.querySelector('.memes-page').style.display = 'none'
    document.querySelector('.gallery-page').style.display = 'none'
    document.querySelector('.meme-editor').style.display = 'none'
    document.querySelector('.about-page').style.display = 'block'
}



