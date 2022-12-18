'use strict'

let gStartPos = { x: 0, y: 0 }
let gElCanvas
let gCtx

const STORAGE_MEMES_KEY = 'My-memes'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']
let gKeywordSearchCountMap = { 'funny': 7, 'cats': 5, 'dogs': 12 }

let gImgs = [
    { id: 1, url: 'imgs/1.jpg', keywords: ['funny', 'tramp', 'politics'] },
    { id: 2, url: 'imgs/2.jpg', keywords: ['cute', 'dogs'] },
    { id: 3, url: 'imgs/3.jpg', keywords: ['funny', 'babys', 'dogs'] },
    { id: 4, url: 'imgs/4.jpg', keywords: ['cute', 'cats'] },
    { id: 5, url: 'imgs/5.jpg', keywords: ['babys', 'yes', 'funny'] },
    { id: 6, url: 'imgs/6.jpg', keywords: ['funny', 'history chanel'] },
    { id: 7, url: 'imgs/7.jpg', keywords: ['babys', 'funny'] },
    { id: 8, url: 'imgs/8.jpg', keywords: ['magician', 'purple'] },
    { id: 9, url: 'imgs/9.jpg', keywords: ['funny', 'babys'] },
    { id: 10, url: 'imgs/10.jpg', keywords: ['funny', 'obama', 'politics'] },
    { id: 11, url: 'imgs/11.jpg', keywords: ['funny', 'kiss'] },
    { id: 12, url: 'imgs/12.jpg', keywords: ['funny', 'haim hecht'] },
    { id: 13, url: 'imgs/13.jpg', keywords: ['leonardo dicaprio', 'movies'] },
    { id: 14, url: 'imgs/14.jpg', keywords: ['matrix', 'movies'] },
    { id: 15, url: 'imgs/15.jpg', keywords: ['games of thrones', 'movies', 'Sean Mark Bean'] },
    { id: 16, url: 'imgs/16.jpg', keywords: ['x-men', 'funny', 'charles xavier'] },
    { id: 17, url: 'imgs/17.jpg', keywords: ['potin', 'politics'] },
    { id: 18, url: 'imgs/18.jpg', keywords: ['movies', 'toy story'] }
]

let gKeyWords = getMemesKeywords()

let gSavedMemes = []

let gMeme = {
    selectedImgId: 1,
    seletedImgIdx: 0,
    seletedLineIdx: 0,
    lines: [
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

function getGCtx() {
    return gCtx
}

function getMemesKeywords() {
    const keywords = []
    gImgs.forEach(imgObj => {
        imgObj.keywords.forEach(key => { keywords.push(key) })
    })
    let uniqueKeys = [...new Set(keywords)]
    return uniqueKeys
}

function getGKeywordSearchCountMap() {
    return gKeywordSearchCountMap
}

function getGMeme() {
    return gMeme
}

function getGMemeSeletedLineIdx() {
    return gMeme.seletedLineIdx
}

function getGMemeLocation() {
    return gMeme.lines[gMeme.seletedLineIdx].location
}

function getGMemeLines() {
    return gMeme.lines
}

function getStartPos() {
    return gStartPos
}

function getEvPos(ev) {
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (TOUCH_EVS.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
        }
    }
    return pos
}

function getGImgs() {
    return gImgs
}

function findImgById(id) {
    const imgObj = gImgs.find(image => id === image.id)
    return imgObj.url
}

function findImgIdxById(id) {
    const imgObjIdx = gImgs.findIndex(image => id === image.id)
    return imgObjIdx
}