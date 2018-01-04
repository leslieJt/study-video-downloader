(() => {
  function toValidFileName(name, removeSpace = true) {
    if (typeof name !== 'string') return '';

    const reg = new RegExp(
      `(~|#|%|&|\\*|{|}|\\|:|<|>|\\?|？|\\/|\\||"${removeSpace ? '|\\s' : ''})`,
      'g'
    );
    return name.replace(reg, '');
  }

  function getLessonInfoFromUrl(url) {
    if (!url) return '';

    const matcher = url.match(/(lessonId=(\d+)&courseId=(\d+))/);

    return {
      lessonId: matcher[2],
      courseId: matcher[3],
      id: `${matcher[2]}-${matcher[3]}`
    };
  }

  function getCurrentTabLessonInfo(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs || tabs.length === 0) return callback();

      return callback(getLessonInfoFromUrl(tabs[0].url));
    });
  }

  function getCurrentTabStorageInfo(callback) {
    getCurrentTabLessonInfo(info => {
      if (!info) return;

      chrome.storage.local.get(info.id, items => {
        const entries = Object.entries(items);
        if (entries.length > 0) {
          // eslint-disable-next-line
          for (let [k, v] of entries) {
            callback({ id: k, value: v });
          }
        } else {
          callback({ id: info.id, value: undefined });
        }
      });
    });
  }

  function patchStorageInfo(partialInfo, callback = () => {}) {
    getCurrentTabStorageInfo(({ id, value = {} }) => {
      const newVal = Object.assign(value, partialInfo);
      chrome.storage.local.set(
        {
          [id]: newVal
        },
        () => callback(newVal)
      );
    });
  }

  // listen event when user click download button
  chrome.runtime.onMessage.addListener(message => {
    if (!message.command) return;
    // download video
    switch (message.command) {
      case 'download':
        getCurrentTabStorageInfo(({ value }) => {
          if (!value) return;

          const filename = toValidFileName(`${value.title}.flv`);

          chrome.downloads.download({
            url: value.videoUrl,
            filename,
            saveAs: true
          });
        });
        break;
      case 'setTitle':
        patchStorageInfo({ title: message.title });
        break;
      default:
        break;
    }
  });

  // listen webrequest in *://video.study.163.com/* domain
  chrome.webRequest.onBeforeRequest.addListener(
    details => {
      if (details.url.includes('flv')) {
        const videoUrl = details.url.replace(/&?start=\d+/, '');

        patchStorageInfo({ videoUrl }, info => {
          if (info.title) return;
          chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { command: 'getTitle' });
          });
        });
      }
    },
    { urls: ['*://video.study.163.com/*'] }
  );

  // chrome.storage.onChanged.addListener((changes, namespace) => {
  //   if (namespace === 'local') {
  //     console.log(('changes:', JSON.stringify(changes)));
  //   }
  // });
})();
