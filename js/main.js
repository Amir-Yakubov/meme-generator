'use strict'

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