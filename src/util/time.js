function formatTime (time) {
  const dateTime = new Date(time);
  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();
  const hour = dateTime.getHours();
  const minute = dateTime.getMinutes();
  const second = dateTime.getSeconds();
  return [[year, addZero(month), addZero(date)].join('-'), [addZero(hour), addZero(minute), addZero(second)].join(':')].join(' ');
}

function addZero (v) {
  return v < 10 ? '0' + v : v;
}

export default{
  formatTime
};
