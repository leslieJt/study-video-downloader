var filenameInterval = setInterval(function () {
  var selector = document.querySelector('span.cl-lessonname')
  if (!selector) return;
  var filename = selector.innerText;

  if (filename) {
    chrome.storage.local.set({ filename: filename + '.flv' });
    clearInterval(filenameInterval);
  }
}, 2000);

var sectionInterval = setInterval(function () {
  var chapterList = document.querySelector('.m-chapterList');
  if (!chapterList) return;

  chapterList.onclick = function (event) {
    var filename = toVaildFileName(event.target.innerText);
    if (filename) {
      chrome.storage.local.set({ filename: filename + '.flv' });
      clearInterval(sectionInterval);
    }
  }
});

function toVaildFileName(filename) {
  if (!filename) return
  return filename.toLocaleString().replace(/[\<\>\:\/\\\|\?\*]/g, '');
}