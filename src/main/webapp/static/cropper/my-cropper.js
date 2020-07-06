/**
 * version: 1.3.1
 * Created by Administrator on 2017/11/21.
 *  调用示例：
 *  myCropper.Init({
		wrapId: 'img-container',             //容器id
		clickShowPanel: true,                //为 true 自动开启截图面板
		cropWidth: 180,                      //裁剪框宽度，非必需,如不传则可以改变裁剪框
		cropHeight: 40,                      //裁剪框高度，非必需,如不传则可以改变裁剪框
		wrapWidth: 440,                      //裁剪框外层背景容器宽度，非必需
		wrapHeight: 440,                      //裁剪框外层背景容器宽度，非必需
		imgUrl: ''，                         //网络图片地址，如果不使用，不用传
		callback: function (result) {        //回调   result.status == 1：成功  result.status == 0：失败
			console.log(result.content.url)  // result.content：成功后返回的值，包含url   result.msg：失败返回的提示信息；
		}
	})
 */

(function (window) {
  var myCropper = {};
  var plus = 'data:image/png;base64,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';
  var dwindle = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAANZ0lEQVR4Xu3dXYicVxkH8P+ZlUSxAS9MFapXIoheWC9E6EU0qIlaMWRnk1CqLVasmWlsK7Ze1ki9aZUYjdnZRq1ovIjJTGK1rSgGEVQIiFZFMAUvKsGPWPCjKWJ058i7yWRnw+zOe76ec553/nsjNOfjmf/z/va8u+/saMAvJsAE1k3AMBsmwATWT4BAeHUwgQ0SIBBeHkyAQHgNMAG/BHiC+OXGWTOSAIHMSKP5Mv0SIBC/3DhrRhIgkBlpNF+mXwIE4pcbZ81IAgQyI43my/RLgED8cuOsGUkgCZDOwL6r1zY/mpEM+TIzJ9Dp24eWh/jisb3mn7FLiQ6kO7CfBPB5AF9ebJuPxy6Y6zGBawlYa7qncRzA7QB+OfcybD/yPvOvmAlFBdId2E8DODhWIJHE7BbXWk1gLY7Rf4+OJBqQTt9+zhg8MKGHRMILO24Ck3FcQ/LCDdh2fKd5McamUYB0B/YIgAMbFEQkMbrFNYCNcVxJyOLcC1vwzhhIgoHUwDEq+iuLC+Zu9pgJeCdQB8do8UhIgoB0+/YYDD5a+wVbEEntsDhwTQIuOCIi8QbSHdhvALjDuY1E4hzZzE/wwTGGZPMQ27+w1/zbJ0cvIN44VovmSeLTrVmcE4JjNa+fbl7GDh8kzkA6A3u3AR4L7ZUFer226Yau4zr/nr59mzV4r8s828K53m7zfZc5JY/tDuxbAdzqUuPQ4BdL8+ZJlzkxxgZ/M75ahLU41Fsw1TM6py9nILV+i1C3hAy3W92+vQ8Gh+uWWI2zwJFe29zrMqfksd2Brb4xHXWp0Vos9RZMx2VO0Ng4J8eoBLkTZGXHmMULIyEQoHggMa8vwBtHdam7nyDXfo5Y85g/6JsFgG8uts2doYvUmU8ghQMpCEcYkNWT5CSAhToX55QxIkgIpGAgheEIB1K98cra1sXT+LYWJARSKJACcUQBUi2iCQmBFAgkJg6LcyHPPa6/y/H/GeS6lbQgIZDCgETGEes9WKPLOxoQLScJgRQEpHAc0W6xxg+T0k8SAikHSHdgv3X1j53CfscT6Y2Jk4qIeoKMNoiJxAInem1zW1iCq7MJpAwg3b79GgzuCu5rQhxJTpDSkRBIfiBacCQFEvtnklgnCYHkBaIJR3IgJSIhkHxAtOEQAVIaEgLJA0QjDjEgJSEhEHkgWnGIAikFCYHIAtGMQxxICiSvmsftB40Z1v11IYHIAdGOIwuQ2EgAnLlxHgt1kRCIDJAm4MgGJCcSAkkPpCk4sgLJhYRA0gJpEo7sQHIgIZB0QJqGowgg0kgIJA2QJuIoBogkEgKJD6SpOIoCkgLJ35ax59Reszz+K2ACiQukyTiKAxIbiQWeen4Zu8aREEg8IE3HUSSQ1EgIJA6QWcBRLJCUSAgkHMis4CgaSCokW1s4wI8e9f/o0VnCUTyQFEisxdmWwaG6792qxvGzeatPm8WSATZp+DNZl95OG5vkb9Knber67zH/xh3A7wC8yaUGAln5LvF7GLzBJbeJYxP/DXlwfdctoAJI7JPENUQCcU1snfHKcKi4xRqPOvJJUrvrBFI7qvUHKsShDkiuk4RAAoEoxaESSA4kBBIARDEOtUCkkRCIJxDlOFQDGSH562mcMcAHPFtYaxqB1Ipp7aAG4FAPpHoBe07auVfO4XRKJATiCKQhOBoBRAIJgTgAaRCOZEC6p+wtaGGHQ6yxhu4DIjzMuq6aIfDdpbbZFavI3OvsH9hHWsCnEtRxwQDHLXA5wdrrLmkMfnV03jyRYs8kDwo7ffugMXg0RcE51hwCv15qm5tz7J1iz87AnjBA9c2kGV8Wjy8umI+keDEEUiNVAqkRUs4hBJIzfYBA8uY/dXcCmRpR0gEEkjTe8MUJJDzDkBUIJCQ9gbkEIhDyBlsQSN78p+5OIFMjSjqAQJLGG744gYRnGLICgYSkJzCXQOKFbC2AFmCq/635RSArf3ILk+ShQM0mbDSMQCKEOFqiguHYaAIhkIhXIFD0k3QCgc+TdJ4gEYkQSMQwEyxFIPVDdbzZqLdwxjcrTi3QAjcBeP3UgWMDLHB2qW0edplT8thO394Jgw+71GgN/tSyeNZljtRYdW9WlAqG+zCB1AkkOUFSF831mYBUAgQilTT3UZkAgahsG4uWSoBApJLmPioTIBCVbWPRUgkQiFTS3EdlAgSism0sWioBApFKmvuoTIBAVLaNRUslQCBSSXMflQkQiMq2sWipBAhEKmnuozIBAlHZNhYtlQCBSCXNfVQmQCAq28aipRIgEKmkuY/KBAhEZdtYtFQCBCKVNPdRmQCBqGwbi5ZKgECkkuY+KhMgEJVtY9FSCRCIVNLcR2UCBKKybSxaKgECkUqa+6hMgEBUto1FSyVAIFJJcx+VCRCIyraxaKkECEQqae6jMgECUdk2Fi2VAIFIJc19VCZAICrbxqKlEiAQqaS5j8oECERl21i0VAIEIpU091GZAIGobBuLlkqAQKSS5j4qEyAQlW1j0VIJEIhU0txHZQIEorJtLFoqAQKRSpr7qEyAQFS2jUVLJUAgUklzH5UJEIjKtrFoqQQIRCpp7qMyAQJR2TYWLZUAgUglzX1UJkAgKtvGoqUSIBCppLmPygQIRGXbWLRUAgQilTT3UZlAEiDd79jXDv+L15WYiAG2LgM3udRmXoLfPrbbnHWZU/LY/U/Ytwwv4+0uNc4ZPG8tLrjMkRprNuHPvV3mfIr9kgDp9O2DxuDRFAUHr2kBOL5qa/Gb3oJ5c/DehSzQGdgTBtjnUo61gHHMzWX9kLEW+Hqvbe4KWWO9uUleMoGkaFW8NQmkfpYEUiMrniAAT5AaF0rdITxB6iaVZ5zPCQKPW1OpV8dbLKmk19mHJwhPkKiXYNEniMcrJRCP0ASn8AQRDHvSVgSSuQFTtieQhP2pc2tNIAkbEGFpAokQYsgSBBKSXvq5BJI+4w13IJDMDeAtVuEN4JP0ohvEEyRze3iCZG5A006Q7sDus0BHOlYLvKaF+G+StMBPem3zDunXk2q/7sAuAfjYtfWr91NUv60I/7pggT+EL+O2ggGeXmybJO/9S/JWE7eXF2d0t2/vg8HhOKutXcUCR3ptc2+KtXOs2R3YLoCjKfa2wOFe23wixdo51mwEkJQ4qqYQiNul2SQk6oGkxkEgbjhGo5uCRDUQCRwE4gfkam7qb7fUApHCQSD+QJqARCUQSRwEEgZEOxJ1QKRxEEg4EM1IVAHJgYNA4gDRikQNkFg4LHDRADe6tJ2/5l35XfdfYPBql9wmjdX22y0VQKLhsDhvgOMw+KxLowlk5VnQV2HxRmNwi0t22pEUDyQmDtvCttYQt7k+cSeQlT+5Xbq0BQ/c8AJ+OEtIigYSG8fSvLnosyaBXAHSWzCdD/3AvnyWkBQLxOdCnnicW5yvTo4KR/XvPusSyCqQKsNZQlIkEJ+LuA4OArmSks+bFUcnyCjnWUFSHJCUOAgkHpBZOUmKApIaB4HEBTILSIoBIoGDQOIDaTqSIoBI4SCQNEBGSLZcwhkA727Sc5LsQCRxEEg6INXKe07aTVvn8GSTkGQFIo2DQNICaSKSbEBy4CCQ9ECahiQLkFg4YPHMsIWdo4eAde59ffbmg8K1Dwrr5NyU2y1xID4X6MSGWDyzaQ7bD+82/6jTsNEYn/0JxB1IU04SUSA+F2dMHLzFkrnFGu+Z9pNEDEgJOAhEHoj2k0QESCk4CCQPEM1IkgMpCQeB5AOiFUlSIKXhIJC8QDQiSQakRBwEkh+INiRJgJSKg0DKAKIJSXQgJeMgkHKAaEESFUjpOAikLCAakEQDogEHgZQHZAzJCQC7Jz4YdviPsT93KwoQLTgIpEwgV5HMbZ3DqdKQBAOJhcNa/HzzHG51fW+VwzeXlaE+9fK9WH7vxXLtzZ6TtjgkQUB8LrZJoVU4Lm3BjuM7zYuuobqO96mZQGSAlHiSeAPxudBy4+AJUu4t1vi1UdJJ4gVEKw4C0QGkpJPEGUinbz9oDI673tpcP94CPzPLeM/iXnMpdC2X+fv7tm2AAy5zbAtnlubNl1zmlDz2ntN213CI+x1r/F5vwRxynBM8vNO3fWPQDl4IOLjYNp9xXccZyP1n7CsuL+PHMLjZdbPReMmfOXxr5LwyEoh0u/WcMdhxdN486/qqnIFUG4QgIQ7XFnF8IJLn/reMbcf2mj/6JOkFZITkP8t4yuWj8InDp0WcE/AzSRCOal9vINVklw8wJg5e6KEJuJwk1uL88hA7fE+OUa1BQOoiIY7QS4PzRwnUQVLhGP+/vAhJLxjICMl6HztJHCHt4dxJCWyEJCaO4Fus8eInfXoFcfACT5XARCQen5M2rb4oJ8jY8Xfts1mJY1r0/PfQBK4ieRzAHdWHCPp8Ttq0GqICGW3WHdhHsIyHpR8CTnux/PdmJtDp24fwUhzpvd/8PfYrTAIkdpFcjwnkSoBAciXPfVUkQCAq2sQicyVAILmS574qEiAQFW1ikbkSIJBcyXNfFQkQiIo2schcCRBIruS5r4oECERFm1hkrgQIJFfy3FdFAgSiok0sMlcCBJIree6rIgECUdEmFpkrgf8DHDIoX7BunDcAAAAASUVORK5CYII=';
  var leftRotateImg = 'data:image/png;base64,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';
  var rightRotateImg = 'data:image/png;base64,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';
  myCropper.Init = function (config) {
    //初始化截图
    init({
      wrapId: config.wrapId,
      clickShowPanel:  config.clickShowPanel,
      cropWidth: config.cropWidth ? config.cropWidth : 240,
      cropHeight: config.cropHeight ? config.cropHeight : 120,
      wrapWidth: config.wrapWidth ? config.wrapWidth : config.cropWidth ? config.cropWidth : 300,
      wrapHeight: config.wrapHeight ? config.wrapHeight : config.cropHeight ? config.cropHeight : 150,
      imgUrl: config.imgUrl,
      callback:config.callback,
      cropBoxStatus: config.cropWidth && config.cropHeight ? false : true
    });
  }

  function init(config) {
    var id = config.wrapId;
    var container = document.getElementById(id);
    var previewImage = new Image();
    if(!config.clickShowPanel){
      var wraper = document.createElement('div');
      wraper.id = 'mycropper-wraper';
      wraper.style.width = config.cropWidth + 'px';
      wraper.style.height = config.cropHeight + 'px';
      container.appendChild(wraper);
      //上传input
      var fileBtn = document.createElement('input');
      fileBtn.id = 'cropper-up-file';
      fileBtn.type = 'file';
      wraper.appendChild(fileBtn);
      //预览图片
      previewImage.id = 'cropper-preview';
      wraper.appendChild(previewImage);
      //上传input label
      var fileBtnLabel = document.createElement('label');
      fileBtnLabel.setAttribute('class','cropper-file-btn');
      fileBtnLabel.setAttribute('for','cropper-up-file');
      fileBtnLabel.innerHTML = '开始截图';
      wraper.appendChild(fileBtnLabel);
      if(config.imgUrl){
        previewImage.width = config.cropWidth;
        previewImage.height = config.cropHeight;
        previewImage.src = config.imgUrl;
        fileBtn.setAttribute('disabled','disabled');
        fileBtnLabel.classList.add('hideFileBtn');
      }else {
        fileBtnLabel.classList.add('showFileBtn');
      }
    }

    //截图容器
    var mask = document.createElement('div');
    mask.id = 'mycropper-mask';
    mask.setAttribute('class','hideCropper');
    container.appendChild(mask);
    var div = document.createElement('div');
    div.id = 'cropper-wrap';
    mask.appendChild(div);
    var closePanel = document.createElement('span');
    closePanel.id = 'close-panel';
    closePanel.innerHTML = '×';
    div.appendChild(closePanel);
    var picWrap = document.createElement('div');
    picWrap.id = 'cropper-pic';
    picWrap.style.width = config.wrapWidth && config.wrapWidth > config.cropWidth ? config.wrapWidth + 'px' : (config.cropWidth + 40) + 'px';
    picWrap.style.height = config.wrapHeight && config.wrapHeight > config.cropHeight ? config.wrapHeight + 'px' : (config.cropHeight + 40) + 'px';
    div.appendChild(picWrap);
    //原始图片标签
    var image = new Image();
    image.src = "";
    picWrap.appendChild(image);
    //截图按钮
    var confirmBtn = document.createElement('div');
    confirmBtn.setAttribute('class','cropper-confirm btn');
    confirmBtn.innerHTML = '确定截图';
    div.appendChild(confirmBtn);
    if(!config.clickShowPanel){
      //重新选择
      var resetBtn = document.createElement('label');
      resetBtn.setAttribute('class','cropper-reset-btn btn');
      resetBtn.innerHTML = '重新选择';
      div.appendChild(resetBtn);
    }else {
      confirmBtn.style.right = 400 + 'px';
    }
    //
    var fineTunePlus = new Image();
    fineTunePlus.setAttribute('class','fine-tune-plus pic');
    fineTunePlus.setAttribute('title','点击微调放大');
    fineTunePlus.src = plus;
    div.appendChild(fineTunePlus);
    //
    var fineTuneDwindle = new Image();
    fineTuneDwindle.setAttribute('class','fine-tune-dwindle pic');
    fineTuneDwindle.setAttribute('title','点击微调缩小');
    fineTuneDwindle.src = dwindle;
    div.appendChild(fineTuneDwindle);
    //
    var leftRotate = new Image();
    leftRotate.setAttribute('class','left-rotate-btn pic');
    leftRotate.setAttribute('title','点击向左旋转');
    leftRotate.src = leftRotateImg;
    div.appendChild(leftRotate);
    //
    var rightRotate = new Image();
    rightRotate.setAttribute('class','right-rotate-btn pic');
    rightRotate.setAttribute('title','点击向右旋转');
    rightRotate.src = rightRotateImg;
    div.appendChild(rightRotate);
    var fileLoading = document.createElement('div');
    fileLoading.id = 'cropper-file-loading';
    div.appendChild(fileLoading);
    var load = document.createElementNS('http://www.w3.org/2000/svg','svg');
    load.setAttribute('class','cropper-loading');
    load.setAttribute('viewBox','25 25 50 50');
    load.innerHTML = '<circle class="path" cx="50" cy="50" r="20" fill="none"/>';
    fileLoading.appendChild(load);
    var title = document.createElement('span');
    title.setAttribute('class','cropper-loading-title');
    title.innerHTML = '加载中，请稍等...';
    fileLoading.appendChild(title);
    var loadingMask = document.createElement('div');
    loadingMask.id = 'cropper-loading-mask';
    picWrap.appendChild(loadingMask);
    var loading = document.createElementNS('http://www.w3.org/2000/svg','svg');
    loading.setAttribute('class','cropper-loading');
    loading.setAttribute('viewBox','25 25 50 50');
    loading.innerHTML = '<circle class="path" cx="50" cy="50" r="20" fill="none"/>';
    loadingMask.appendChild(loading);
    var text = document.createElement('span');
    text.setAttribute('class','cropper-loading-title');
    text.innerHTML = '截图中，请稍等...';
    loadingMask.appendChild(text);
    var options = {
      minCropBoxWidth: config.cropWidth,    //裁剪框宽度
      minCropBoxHeight: config.cropHeight,  //裁剪框高度
      viewMode : 0,                      //显示
      guides :false,//裁剪框虚线 默认true有
      dragMode : "move",
      background : false,// 容器是否显示网格背景
      movable : true,//是否能移动图片
      cropBoxMovable : config.cropBoxStatus,//是否允许拖动裁剪框
      cropBoxResizable : config.cropBoxStatus,//是否允许拖动 改变裁剪框大小
    };

    var cropperObj = new Cropper(image, options);
    var status = false;
    var result = new Object;

    if(!config.clickShowPanel){
      fileBtnLabel.onclick = start;
    }else {
      start();
    }

    function start() {
      if(config.imgUrl || previewImage.src){
        fileLoading.style.display = 'block';
        openWrap();
        var url = previewImage.src ? previewImage.src : config.imgUrl;
        convertImgToBase64(url, function(base64Img){
          fileLoading.style.display = 'none';
          if(!config.clickShowPanel) {
            resetBtn.setAttribute('for','cropper-up-file');
            fileBtn.removeAttribute('disabled');
          }
          cropperObj.reset().replace(base64Img);
          status = true;
        });
      }
    }

    if(!config.clickShowPanel) {
      fileBtn.onchange = function () {
        upFile(this.files[0]);
        fileBtn.value = '';
      }
    }

    fineTunePlus.onclick = function () {
      cropperObj.zoom(0.005);
    }

    fineTuneDwindle.onclick = function () {
      cropperObj.zoom(-0.005);
    }

    leftRotate.onclick = function () {
      cropperObj.rotate(-90);
    }

    rightRotate.onclick = function () {
      cropperObj.rotate(90);
    }

    confirmBtn.onclick = function () {
      if( status ){
        var cropBoxData = cropperObj.getCropBoxData();
        var width = cropBoxData.width;
        var height = cropBoxData.height;
        var canvas = cropperObj.getCroppedCanvas({
          width: width,
          height: height
        })
        var picBase = canvas.toDataURL('image/png');
        putb64(picBase);
      }else {
        result.status = 0;
        result.msg = '请先上传图片';
        config.callback(result);
      }
    }

    mask.onclick = function (e) {
      var ev = e || window.event;
      if(ev.target == this){
        closeFn();
      }
    }
    closePanel.onclick = function () {
      closeFn();
    }

    function closeFn() {
      if((config.imgUrl || previewImage.src) && !config.clickId){
        fileBtn && fileBtn.setAttribute('disabled','disabled');
      }
      closeWrap();
      loadingMask.style.display = 'none';
      image.src = '';
      cropperObj.destroy();
    }

    function upFile(file) {
      if(file){
        fileLoading.style.display = 'block';
        var filesName = file.name;
        if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(filesName)) {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function(){
            cropperObj.reset().replace(this.result);
            fileLoading.style.display = 'none';
            status = true;
            resetBtn.setAttribute('for','cropper-up-file');
          }
          if(mask.style.opacity !== 1){
            openWrap();
          }
        }else {
          result.status = 0;
          result.msg = '图片类型必须是.gif,jpeg,jpg,png中的一种';
          config.callback(result);
          fileLoading.style.display = 'none';
          return;
        }
      }
    }

    function putb64(picBase){
      if(myCropperToken.indexOf('error')>-1 || myCropperToken == ''){
        result.status = 0;
        result.msg = 'token获取失败，请联系管理员';
        config.callback(result);
        if((config.imgUrl || previewImage.src) && !config.clickShowPanel) fileBtn.setAttribute('disabled','disabled');
        closeWrap();
        loadingMask.style.display = 'none';
        cropperObj.destroy();
        return;
      }
      picBase = picBase.split(',')[1];
      /*把字符串转换成json*/
      function strToJson(str) {
        var json = JSON.parse(str );
        return json;
      }
      var nowDate = new Date();
      var year = nowDate.getFullYear();
      var month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1): nowDate.getMonth() + 1;
      var day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
      var dateStr = year.toString() + month.toString() + day.toString();
      var key = 'cropper/' + dateStr +'/'+ getUUID()+'.png';
      var b = new Base64();
      key = b.encode(key);
      key.replace('+','-');
      key.replace('/','_');
      var url = "https://upload.qiniup.com/putb64/-1/key/"+key;
      var xhr = new XMLHttpRequest();
      loadingMask.style.display = 'block';
      xhr.onreadystatechange=function(){
        if (xhr.readyState==4) {
          if (xhr.status == 200) {
            var keyText = xhr.responseText;
            keyText = strToJson(keyText);
            result.status = 1;
            result.content = keyText.content;
            if(!config.clickShowPanel){
              previewImage.src = result.content.url;
              fileBtn.setAttribute('disabled','disabled');
              fileBtnLabel.setAttribute('class','cropper-file-btn hideFileBtn');
            }
          } else {
            result.status = 0;
            result.msg = '网络繁忙，截图失败。';
            if((config.imgUrl || previewImage.src) && !config.clickShowPanel) fileBtn.setAttribute('disabled','disabled');
          }
          config.callback(result);
          closeWrap();
          loadingMask.style.display = 'none';
          image.src = '';
          cropperObj.destroy();
        }
      }
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("Authorization", "UpToken "+ myCropperToken);
      xhr.send(picBase);
    }

    function convertImgToBase64(url, callback){
      var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = new Image;
      if(url.indexOf('data:image/')>-1){
        img.src = url;
      }else {
        img.src = url + '?' + new Date().getTime();
      }
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        callback.call(this, dataURL);
        canvas = null;
      };
    }

    function getParent(container,type){
      if( container.parentNode.className.search('panel window')>-1){
        if(type == 'inherit'){
          container.parentNode.classList.add('overflow-inherit');
        }else {
          container.parentNode.classList.remove('overflow-inherit');
        }
      }else {
        if(container.parentNode == document.documentElement){
          return;
        }
        getParent(container.parentNode,type);
      }
    }

    function openWrap() {
      mask.classList.remove('hideCropper');
      mask.classList.add('showCropper');
      getParent(container,'inherit');
    }

    function closeWrap() {
      mask.classList.remove('showCropper');
      mask.classList.add('hideCropper');
      getParent(container,'hidden');
    }

    //uuid
    function getUUID(){
      var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
      var uuid = [];
      var i;
      var r;
      for (i = 0; i < 32; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
      return uuid.join('');
    }

    function Base64() {
      // private property
      var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      // public method for encoding
      this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);
          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;
          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }
          output = output +
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
      }
      // public method for decoding
      this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
          enc1 = _keyStr.indexOf(input.charAt(i++));
          enc2 = _keyStr.indexOf(input.charAt(i++));
          enc3 = _keyStr.indexOf(input.charAt(i++));
          enc4 = _keyStr.indexOf(input.charAt(i++));
          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;
          output = output + String.fromCharCode(chr1);
          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }
        }
        output = _utf8_decode(output);
        return output;
      }
      // private method for UTF-8 encoding
      var _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
          var c = string.charCodeAt(n);
          if (c < 128) {
            utftext += String.fromCharCode(c);
          } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
          } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
          }

        }
        return utftext;
      }
      // private method for UTF-8 decoding
      var _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
          c = utftext.charCodeAt(i);
          if (c < 128) {
            string += String.fromCharCode(c);
            i++;
          } else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
          } else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
          }
        }
        return string;
      }
    }
  }

  getToken();

  function getToken() {
    window.myCropperToken = '';
    var xhr = new XMLHttpRequest();
    if(!xhr){
      return ;
    }
    xhr.onreadystatechange=function(){
      if(xhr.readyState==4){
        if(xhr.status==200){
          window.myCropperToken = xhr.responseText;
        }
      }
    };
    xhr.open("POST", 'https://toolapi.maytek.cn/qt2', false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send();
  }

  var time = (1000*60*120 - 1000*60*3);

  setInterval(getToken,time);

  window.myCropper = myCropper;

})(window);