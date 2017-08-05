const filenameInterval = setInterval(function () {
  let selector = document.querySelector('span.cl-lessonname')
  if (!selector) return
  const filename = selector.innerText

  if (filename) {
    chrome.storage.local.set({filename: filename + '.flv'})
    clearInterval(filenameInterval)
  }
}, 2000)

const sectionInterval = setInterval(function () {
  let chapterList = document.querySelector('.m-chapterList')
  if (!chapterList) return

  chapterList.onclick = function (event) {
    const filename = toVaildFileName(event.target.innerText)
    if (filename) {
      chrome.storage.local.set({filename: filename + '.flv'})
      clearInterval(sectionInterval)
    }
  }
})

function toVaildFileName (filename) {
  if (!filename) return
  return filename.toLocaleString().replace(/[\<>\:\/\\|\?\*]/g, '')
}
