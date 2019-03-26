function getDeviceId() {
  //生成唯一标识符
  let d = new Date().getTime();
  let deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  console.log(deviceId);
  return deviceId;
}

export default getDeviceId;