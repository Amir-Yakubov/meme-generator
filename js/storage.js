'use strict'

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function saveCanvas() {
    const name = prompt('Save as?')
    const savedMeme = { name, url: gElCanvas.toDataURL("image/png") }
    gSavedMemes = loadFromStorage(STORAGE_MEMES_KEY)
    if (!gSavedMemes) gSavedMemes = []
    gSavedMemes.push(savedMeme)
    saveToStorage(STORAGE_MEMES_KEY, gSavedMemes)
}

function loadImgFromLocalStorage() {
    const savedMemes = localStorage.getItem(STORAGE_MEMES_KEY)
    return savedMemes
}