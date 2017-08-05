const list = document.getElementById('list')
list.textContent = '';
const error = document.getElementById('error')

chrome.storage.local.get('url', function (url) {
  if (!url || !url.url) {
    error.style.display = 'block';
    list.style.display = 'none';
  } else {
    error.style.display = 'none';
    list.style.display = 'block';

    const urlInfo = url.url

    urlInfo.forEach(function (info) {
      if (!info.length) return;
      // if (info.from === 'request') {
      //   var li = document.createElement('div');
      //   li.className = 'item request';
      //   var span = document.createElement('span');
      //   span.textContent = info.address;
      //   li.appendChild(span);
      //   list.appendChild(li);
      // }

      if (info.from === 'response') {
        const li = document.createElement('div')
        li.className = 'item response';
        const span = document.createElement('span')
        chrome.storage.local.get('filename', function (file) {
          span.title = info.address;
          span.textContent = file.filename;
        });
        li.appendChild(span);

        const len = document.createElement('div')
        len.className = 'length';
        len.textContent = '' + info.length + 'MB';
        li.appendChild(len);

        li.onclick = function () {
          chrome.storage.local.get('filename', function (file) {
            chrome.downloads.download({
              filename: file.filename,
              url: info.address,
              saveAs: true,
              method: 'GET'
            });
          });
        };

        list.appendChild(li);
      }
    });
  }
})
