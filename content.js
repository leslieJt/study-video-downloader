(() => {
  function getCurrentLessonTitle() {
    // title
    const titleElm = document.querySelector('.cl-title');
    const lessonNum = titleElm.querySelector('.cl-lessonnum').innerText;
    const lessonName = titleElm.querySelector('.cl-lessonname').innerText;

    return `课时_${lessonNum}_${lessonName}`;
  }

  function sendTitle() {
    chrome.runtime.sendMessage({
      command: 'setTitle',
      title: getCurrentLessonTitle()
    });
  }

  chrome.runtime.onMessage.addListener(message => {
    if (message.command === 'getTitle') {
      sendTitle();
    }
  });

  const id = setInterval(() => {
    const container = document.querySelector('.cl-info');
    if (!container) return;
    clearInterval(id);

    const clis = container.querySelectorAll('.cli-base');

    const lastCli = clis[clis.length - 1];

    // download button
    const downloadElm = document.createElement('a');
    downloadElm.classList.add('cli-base');
    downloadElm.classList.add('cli-download');
    downloadElm.title = '下载';

    // span element
    const spanElm = document.createElement('span');
    spanElm.innerText = '下载';

    // img element
    const imgElm = document.createElement('img');
    imgElm.src = chrome.extension.getURL('icons/download-white.png');

    downloadElm.appendChild(spanElm);
    spanElm.before(imgElm);

    lastCli.after(downloadElm);

    // add event listener to download button
    downloadElm.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        command: 'download'
      });
    });
  }, 250);
})();
