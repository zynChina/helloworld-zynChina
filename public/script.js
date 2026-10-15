window.addEventListener('DOMContentLoaded', () => {
  setInterval(fetchServerTime, 1000);
  fetchServerTime();
});

function fetchServerTime() {
  fetch('/api/time')
    .then((response) => response.json())
    .then((data) => {
      document.getElementById('serverTime').textContent = data.time;
    })
    .catch((error) => {
      document.getElementById('serverTime').textContent = '获取时间失败';
      console.error('获取服务器时间出错：', error);
    });
}
