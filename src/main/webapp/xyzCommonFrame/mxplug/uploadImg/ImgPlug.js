(function(){
  let
    _datakey='',  //用户id
    _scene='',    //场景
    uploadImgIndex = 0,   //图片空间使用的记录img数量的变量
    dt={},   //读取图片接口的图片对象集合
    _groupkey='',   //分组id
    imgArr = [],    //将要上传的图片集合
    _groupInImgCount=0,    //选中分组中已有图片的数量
    groupCount=0,
    sevenNiuDt=[]  //七牛云图片临时暂存

  //加载该控件
  var init = function(datakey){
    $('#imgPlug').empty();
    _datakey=datakey;
    // _scene=scene
    var header_html='<div class="MaytekF-header"><div class="MaytekF-headerTitle">分组上传图片</div><div class="MaytekF-headerTool" onclick="imgPlug.closeImgPlug()"><a href="#" class="close"><span class="iconfont icon-no"></span></a></div></div>'
    var left_html='<div id="mx_uploadimg_group" class="mx_upload_group"><div id="new_group" class="flex_center new_group" onclick="imgPlug.addGroup()">新建分组 +</div><div id="group_list" class="group_list flex_center"></div></div>';
    var right_html='<div class="mx_upload_imgshow"><ul id="uploadingUL" class="uploading-ul"><li id="imgInsert" class="img_item"><form class="img-input-form" style="opacity: 1; cursor: pointer;"><a href="javascript:;" class="file">选择文件 +<input type="file" name="" multiple="multiple" onchange="imgPlug.searchImage(this)" accept="image/gif, image/jpeg, image/png" id="upload"></a></form></li></ul><ul id="uploadul" class="upload-ul"></ul><div class="MForm-footer"><a href="javascript:void(0)" onclick="imgPlug.saveImg(imgPlug.uploadImg)" style="background-color:;color:;"><span class="iconfont undefined"></span>保 存</a><a href="javascript:void(0)" onclick="imgPlug.closeImgPlug()"><span class="iconfont undefined"></span>取 消</a></div></div>'
    var content_html='<div class="mx_upload_content">'+left_html+right_html+'</div>'
    $('#imgPlug').append(header_html);
    $('#imgPlug').append(content_html);
    loadGroup();
    $('#imgPlug').show();
    $('.MaytekF-mask').css('display','block');
    $('#uploadingUL,.upload-ul,.MForm-footer').hide();
  }

  //上传图片
  var uploadImg=function(){
    //let num=0;
    // let group=[{
    //   groupkey:_groupkey,
    //   dataTitle:$('#'+_groupkey).text(),
    //   dataList:[]
    // }]
    $.ajax({
      url: '/InfoCore_InfoCoreWS/getDataInfoForImage.do',
      data:{
        datakey:_datakey,
      },
      success:function(dataJson){
        // var completedgroup = dataJson.content.group;
        // var completedgroup_dataList = dataJson.content.group[0].dataList;
        $.each(imgArr,function(k,file){
          getToken(function(token){
            upload7Niu(file,token,function(data){
              //group[0].dataList.push({
              //  nameCn:data.content.fileName,
              //  sort:_groupInImgCount+k+1,
              //  value:data.content.url
              //})

              let imgObj={
                nameCn: data.content.fileName,
                sort: _groupInImgCount+k+1,
                value: data.content.url
              }

              $.each(dt.group,function(k,v){
                if(v.groupkey==_groupkey){
                  dt.group[k].dataList.push(imgObj)
                }
              })
              //num++
              //当全部加载完执行
              //if (imgArr.length==num){
                // var obj= {
                  //datakey:_datakey,
                  // scene:_scene,
                  //group:group.concat(completedgroup)
                //}
                //saveImg(obj);
                //return obj;
              //}

            })
          })

        })
      }
    })
  }


  //保存图片并提交图片后刷新
  function saveImg(){
    $.ajax({
      url:'/InfoCore_InfoCoreWS/inputDataInfoForImage.do',
      type:'post',
      data:{
        dataJson:JSON.stringify(dt)
      },
      success:function(data){
        loadGroup(function(){
         loadImgInGroup(_groupkey)
        })
      },
      error:function(xhr,type,errorThrown){
      }
    });
  }



  //保存图片并提交图片不刷新
  function saveImgNoRefresh(){
    $.ajax({
      url:'/InfoCore_InfoCoreWS/inputDataInfoForImage.do',
      type:'post',
      data:{
        dataJson:JSON.stringify(dt)
      },
      success:function(data){
        return true;
      },
      error:function(xhr,type,errorThrown){
      }
    });
  }



  //请求并加载组列表()
  function loadGroup(callback){

    $.ajax({
      url: '/InfoCore_InfoCoreWS/getDataInfoForImage.do',
      data:{
        datakey:_datakey,
      },
      success:function(dataJson){
        if (dataJson.status!='1'){
          alert('请求数据异常');
          return false;
        }
        dt=dataJson.content;
        $('#group_list').empty();
        $.each(dt.group,function(k,v){
          $('#group_list').append('<div class="group_item flex_center" id="'+v.groupkey+'" onmouseenter="imgPlug.delBtnshow(\''+v.groupkey+'\')" onmouseleave="imgPlug.delBtnhide(\''+v.groupkey+'\')" onclick="imgPlug.loadImgInGroup(\''+v.groupkey+'\')"><div class="delGroup"><a href="#" class="close"  onclick="imgPlug.deleteGroup(\''+v.groupkey+'\')"><span class="iconfont icon-no"></span></a></div>'+v.dataTitle+'</div>');
        })
        if(typeof callback==='function'){
          callback();
        }
        groupCount = dt.group.length;
      }
    })
    // var str='{"datakey":"A000001","scene":"","group":[{"groupkey":"G001","dataTitle":"身份证","dataList":[{"nameKey":"F092971FCBF2DB7B5878DDEA4ED44799","nameCn":"img001.jpg","sort":0,"value":"https://file.maytek.cn/editorImg/2055/F092971FCBF2DB7B5878DDEA4ED44799"},{"nameKey":"F092971FCBF2DB7B5878DDEA4ED44799","nameCn":"img002.jpg","sort":1,"value":"https://file.maytek.cn/editorImg/2055/F092971FCBF2DB7B5878DDEA4ED44799"}]},{"groupkey":"G002","dataTitle":"护照","dataList":[{"nameKey":"F092971FCBF2DB7B5878DDEA4ED44799","nameCn":"img001.jpg","sort":0,"value":"https://file.maytek.cn/editorImg/2055/F092971FCBF2DB7B5878DDEA4ED44799"}]}]}'
    // dt=JSON.parse(str)
    // $('#group_list').empty()
    // $.each(dt.group,function(k,v){
    //     $('#group_list').append('<div class="group_item flex_center" id="'+v.groupkey+'" onclick="imgPlug.loadImgInGroup(\''+v.groupkey+'\')">'+v.dataTitle+'</div>');
    // })
    // if(typeof callback==='function'){
    //     callback();
    // }
    // groupCount=dt.group.length;
    // console.log(groupCount);
  }




  function delBtnshow(id){
    //_groupkey=id;
    $('#'+id+' .delGroup').attr('style','display:block');
  }
  function delBtnhide(id){
    //_groupkey=id;
    $('#'+id+' .delGroup').attr('style','display:none');
  }
  //读取某一组中的图片列表
  function loadImgInGroup(id){
    if(id==null||id==undefined||id==''){
      alert('未选择相应分组');
      return false;
    }
    _groupkey=id;
    imgArr=[];
    $('.activegroup').removeClass('activegroup');
    $('#'+_groupkey).addClass('activegroup');
    $('#uploadingUL,.upload-ul,.MForm-footer').fadeIn(200);
    $.each(dt.group,function(k,v){
      if(v.groupkey==id){
        $('#uploadul').empty();
        $('#uploadingUL li:not(#imgInsert)').remove();
        var imgList=dt.group[k].dataList
        _groupInImgCount=imgList.length
        $.each(imgList,function(ik,iv){
          // let nameKey=$.md5(_datakey+iv.nameCn+Date.parse(new Date()));
          let urls=iv.value.split('/');
          urls=urls[urls.length-1];
          $('#uploadul').append('<li class="img_item" id="'+urls+'"><div class="item image"><img src="'+iv.value+'" class="upload-image"><span class="iconfont icon-closeTabs delete-image" onclick="imgPlug.deleteImage(\''+urls+'\')"></span></div><div class="text-area"><input type="text" value="'+iv.nameCn+'"></div></li>')
          $('#'+urls).hover(function(){
            $('#'+urls+' .delete-image').stop().fadeToggle(50)
          });
        });
      }
      });

  }
  //获取token
  function getToken(callback){
    var uploadToken;
    var ieFlag = navigator.userAgent.indexOf('MSIS') != -1;
    var xhr = new XMLHttpRequest();
    if(ieFlag){
      xhr = new XDomainRequest();
    }
    if(!xhr){
      return;
    }
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        if(xhr.status = 200){
          uploadToken =xhr.responseText;
        }else{
          uploadToken = ';'
        }
        if(callback){
          callback(uploadToken);
        }
      }
    };
    var paramArray = new Array();
    var param = paramArray.join('&').replace('%20','+');
    xhr.open("POST",'https://toolapi.maytek.cn/qt2',true);
    if(!ieFlag){
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
      xhr.setRequestHeader("Accept","application/json, text/javascript, */*; q=0.01");
      xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
    }
    xhr.send(param);
  }
  //添加一个分组
  function addGroup(){
    $('#uploadingUL li:not(#imgInsert)').remove();
    var groupName=null;
    $.messager.prompt('上传图片', '请输入组名:', function(groupName){
        if (groupName!='' && groupName!=null){
          let this_md5=$.md5(_datakey+groupName+Date.parse(new Date()));
          $('#group_list').append('<div id="'+this_md5+'" class="flex_center" onclick="imgPlug.loadImgInGroup(\''+this_md5+'\')">'+groupName+'</div>');
          _groupkey=this_md5;
          dt.group.push({
            groupkey:_groupkey ,
            dataTitle: groupName,
            dataList:[]
          })
          $('.activegroup').removeClass('activegroup');
          $('#'+_groupkey).addClass('activegroup');
          $('#uploadul li').remove()
          $('#uploadingUL,.MForm-footer').fadeIn(200)
        }

    });

  }
  //删除单个img
  function deleteImage(id){
    $.each(dt.group,function(gk,gv){
      if(gv.groupkey==_groupkey){
        $.each(dt.group[gk].dataList,function(ik,iv){
            let urls=iv.value.split('/');
            let img_key=urls[urls.length-1];
            if(img_key==id){
              dt.group[gk].dataList.splice(ik,1)
              $('#'+id).remove()
              //saveImgNoRefresh()
              return false;
            }
        })
      }
    })
  }
  //删除一个分组
  function deleteGroup(id){
    $.each(dt.group,function(k,v){
      if(v.groupkey==id){
            dt.group.splice(k,1)
            $('#'+id).remove()
            //saveImgNoRefresh()
            if(_groupkey==id){
              $('#uploadul li').remove()
            }
            return false
            // if(dt.group.length==0){
            //   $('#uploadingUL,.MForm-footer').hide()
            // }
      }
      // _groupkey=dt.group[0].groupkey;
      // $('#'+_groupkey).addClass('activegroup');
    })
    return false;
  }
  //关闭图片上传插件
  function closeImgPlug(){
    $('#imgPlug').hide();
    $('.MaytekF-mask').css('display','none');
  }
  function getUUID() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [];
    var i;
    var r;
    for (i = 0; i < 32; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join('');
  }
  function searchImage(imgFile) {
    var allFile = imgFile.files;
    var totalLen = allFile.length;
    if(imgArr.length>0){
      totalLen = totalLen + imgArr.length;
    }
    // for (var k = 0; k < imgArr.length; k++) {
    //   if (imgArr[k].getAttribute('nameid') === files.name) {
    //     top.$.messager.alert("提示", '请勿上传相同文件', "warning");
    //     return false
    //   }
    // }

    //var files = imgFile.target.files[0];
    for(var i=0;i<allFile.length;i++){
      var file = allFile[i];
      // if(file.getAttribute('nameid'===files.name)){
      //     top.$.messager.alert("提示", '请勿上传相同文件', "warning");
      //     return false
      // };
      if(imgArr.length>0){
        imgArr.push(file);
      }else{
        imgArr.push(file);
      }
      var file = allFile[i];
      //添加一层过滤
      var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
      if(!rFilter.test(file.type)) {
        alert("文件格式必须为图片");
        return;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file); //用文件加载器加载文件
      //文件加载完成
      reader.onload = function(e) {
        //计算最后一个窗口right边距，当时处于第4个的时候，right=0
        if((allFile.length + 1)%4 == 0){
          document.getElementById("imgInsert").style.marginRight = "0px";
        }
        //以下就是将所有上传的图片回显到页面上
        var li = document.createElement('li');
        li.id = "upload_"+uploadImgIndex;
        document.getElementById("imgInsert").style.display = "";
        uploadImgIndex++;
        li.className = "img_item";
        //li.
        li.innerHTML = '<div class="item image">'+
          '<img class="upload-image" src="'+e.target.result+'"/>'+
          // '<img class="delete-image" src="xyzCommonFrame/mxplug/uploadImg/del.png" />'+
          '<span class="iconfont icon-closeTabs delete-image"></span>'+
          '</div>';
        document.getElementById("uploadingUL").insertBefore(li, document.getElementById("imgInsert"));
      };
      reader.onloadend = function(e) {
        $(".delete-image").off('click');
        $(".delete-image").on('click',function(){
          // alert("dasd");
          var li = $(this).parent().parent()[0];
          var index = $(".uploading-ul .img_item").index(li);
          var liId = li.id;
          $("#"+liId).remove();
          imgArr.splice(index,1);
            //document.getElementById("img_item").style.display = "";
        });
      }
    }
    imgPlug.uploadImg();
  }


  //上传到七牛云
  function upload7Niu(file,MxEditorToken,callback){
    var qiniuUrl = 'https://upload.qiniup.com';
    var errCodeMsg = {
      'code400': '报文构造不正确或者没有完整发送。',
      'code401': '上传凭证无效。',
      'code403': '上传文件格式不正确。',
      'code413': '上传文件过大。',
      'code579': '回调业务服务器失败。',
      'code599': '服务端操作失败。',
      'code614': '目标资源已存在。'
    };

    if (MxEditorToken.indexOf('error') > -1 || MxEditorToken == '') {
      top.$.messager.alert("提示", 'token获取失败,请联系管理员', "warning");
      return;
    }

    //构建xhr上传表单参数
    var form = new FormData();
    form.append('file', file);
    form.append('token', MxEditorToken);
    form.append('x:folder', 'editorImg');
    //优化自定义文件名模式

    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
    form.append('key', 'editorImg/' + dd + '/' + getUUID());

    //构建xhr对象
    var xhr = new XMLHttpRequest();
    xhr.open('POST', qiniuUrl, true);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    //上传进度回调
    xhr.upload.onprogress = function (event) {
      //console.log();
    };
    if (xhr.ontimeout) {//暂时不用
      xhr.ontimeout = function (event) {
        //console.log('上传已超时');
      };
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resultData = xhr.responseText;
          try {
            resultData = eval('(' + xhr.responseText + ')');
          } catch (e) {
            resultData = {
              status: 0,
              msg: '上传失败，返回数据异常'
            };
          }
          if (resultData.content && resultData.content.suffix) {//qiniu处理
            resultData.content.suffix = resultData.content.suffix.replace('.', '');
          }
          callback(resultData);

        } else {
          var resultData = {
            status: 0,
            msg: errCodeMsg['code' + xhr.status] ? errCodeMsg['code' + xhr.status] : xhr.statusText
          };
          callback(resultData);
        }
      }
    };
    xhr.send(form);//发射
  }

  window.imgPlug = {
    init:init,
    uploadImg:uploadImg,
    loadImgInGroup:loadImgInGroup,
    loadGroup:loadGroup,
    addGroup:addGroup,
    closeImgPlug:closeImgPlug,
    deleteImage:deleteImage,
    delBtnshow:delBtnshow,
    delBtnhide:delBtnhide,
    deleteGroup:deleteGroup,
    saveImg:saveImg,
    searchImage:searchImage
  };



}())
