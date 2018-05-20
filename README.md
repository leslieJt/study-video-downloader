# 安装

[![Greenkeeper badge](https://badges.greenkeeper.io/leslieJt/study-video-downloader.svg)](https://greenkeeper.io/)

网易云课堂 当前页视频 下载

## 基本逻辑

* background:
  * 通过 webRequest 监听`*://video.study.com/*`域下请求，发现`flv`关键词，即认为是视频请求，相关信息添加到`storage`中；
  * 随即向页面发送信息，请求当前视频地址名称，patch 到对应`storage`信息中；
* content:
  * 页面加载时，轮询播放器元素是否加载，加载完成后，追加下载按钮到页面中；
