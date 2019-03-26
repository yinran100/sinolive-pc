export function preloadImages(imgs) {
  //已加载完的图片数萤 
  let loadedImage = 0
  //存放图片的数组 
  let newImages = []
  //返回一个Promise对象
  return new Promise((resolve, reject) => {
    for (let i = 0; i < imgs.length; i++) {
      newImages[i] = new Image()
      //设置囝片src属性
      newImages[i].src = imgs[i]
      //图片绑定onload事件，确保加载完成 
      newImages[i].onload = () => {
        loadedImage++
        //当全部加载完成后，resolve 
        if (loadedImage === imgs.length) {
          resolve()
        }
      }
      newImages[i].onerror = () => {
        reject()
      }
    }
    if (imgs.length == 0) resolve()
  })
}
