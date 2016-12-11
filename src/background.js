chrome.storage.local.clear(function () {
  // Request.
  // chrome.webRequest.onSendHeaders.addListener(function (details) {
  //   var headers = details.requestHeaders;

    // X-Requested-With:ShockwaveFlash
    // storageIfHeaderMatch(headers,
    //   {
    //     name: 'X-Requested-With',
    //     value: 'ShockwaveFlash',
    //     from: 'request'
    //   },
    //   details);
  // },
  //   { urls: ["<all_urls>"] }, ['requestHeaders']);

  // Reponse.
  chrome.webRequest.onResponseStarted.addListener(function (details) {
    if (details.statusCode != 200 || details.url.includes('start')) return;

    var headers = details.responseHeaders;

    // Content-Type:video/x-flv
    storageIfHeaderMatch(headers,
      {
        name: 'Content-Type',
        value: 'video/x-flv',
        from: 'response'
      }, details);
  },
    { urls: ["<all_urls>"] }, ['responseHeaders']);
});

function storageIfHeaderMatch(header, match, details) {

  var index = header.findIndex(h => h.name === match.name && h.value.includes(match.value))

  if (index === -1) return;

  chrome.storage.local.get('url', function (urls) {
    var length = getLength(header);
    if (!length) return;

    // if (!urls || !urls.url) {
    chrome.storage.local.set({ 'url': [{ address: details.url, from: match.from, length: length }] });
    // } else {
      // urls.url.push({ address: details.url, from: match.from });
      // chrome.storage.local.set({ 'url': urls.url });
    // }
  });
}

function getLength(header) {
  var index = header.findIndex(h => h.name === 'Content-Length');
  if (index !== -1) {
    return (Number.parseFloat(header[index].value) / 1024 / 1024).toFixed(3);
  } else {
    return undefined;
  }
}
