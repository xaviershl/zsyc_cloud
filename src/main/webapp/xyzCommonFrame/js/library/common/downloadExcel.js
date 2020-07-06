let $editExcelHtml =
    $(`
       <div class='inner-wrap paCenter pd20 br6'>
            <p class='title-box fs16 primary pb12 clearfloat'>下载excel<i class='iconfont icon-chacha' id='closeDownload'></i></p>
            <!-- 选择excel区域 开始  -->
            <div class='item clearFloat pt14 pb13 pl20'>
                <span class='pt10 pb10 fl fs14 mr10'>选择excel对象</span>
                <div class='select-box pr fl'>
                   <input type='text' autocomplete='off' placeholder='请选择excel对象' id='excelVal' class='input-box formControl pr29' />
                   <input type='hidden' id='excelCode' value=''/>
                   <i class='iconfont icon-navup pa'></i>
                   <div class='dropDown-box' id='dropdown'> 
                      <ul></ul>
                   </div>
               </div>
               
               <!-- 刷新按钮 -->
               <i class='iconfont icon-shuaxin' id='refreshExcelList' style='color: #3b72a8;margin: 8px 15px;font-size: 19px;display: inline-block;cursor: pointer;'></i>
               <span class='add-excel' id='addCustomExcel' style='width: 107px' onclick="window.addCustomExcel()">定制excel模板</span>
            </div>
            <!-- 选择excel区域 结束  -->
            
            <!-- 编辑Excel区域 开始 -->
            <div class='item clearFloat'>
               <!-- 编辑区域 -->
               <div class='query-result pd20'>
                   <div class='maytekQ-box xyz_search mb19'>
                       <div id='downloadExcel-search'></div>
                   </div>
                   <div class='clearFloat mb10'>
                      <h6 class='selectednum gray fs14 pd6' style='float:left;font-weight: normal;margin: 0;display: inline-block'></h6>
                      <div class='mode-switch'><span class='preview-mode'>预览格式</span><span class='quick-edit'>快捷编辑</span></div>
                  </div>   
                   <p class='excelItem fs14 gray dk'></p>
                   <!-- 定制类型下的预览格式 -->
                   <div class='preview-tab table-cont dk'></div>
               </div>
               <!-- 查询结果 -->
               <p class='reslutItem fs12 mt10'></p>
              </div>
            <!-- 编辑Excel区域 结束 -->
            
            <!-- 下载按钮 开始-->
            <div class='btn-box tc mt30'>
              <button class='btn btnPrimay mr20 br6 download'>确认下载</button>
              <button class='btn btnGray br6 cancelDownload'>取消</button>
           </div>
            <!-- 下载按钮 结束-->
       </div>
       <!-- 快捷编辑模块 开始-->
       <div class='edit-box paCenter sd15 pd20' id='editBox'>
            <div class='select-group pr pl17 clearfloat'>
               <span><i class='iconfont icon-fuxuankuangxuanzhong' id='checked'></i>已选择</span>
               <span><i class='iconfont icon-fuxuankuang1' id='notCheck'></i>未选择</span>
               <span class='refresh' id='refresh'>刷新</span>
               <div class='search-item'><input type='text' id='searchItemInput' placeholder='请输入查询条件' />
                   <svg t='1568276371089' id='searchItembtn' class='icon search-btn' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='1180' width='32' height='32'>
                       <path d='M990.980258 969.944422l-185.094554-185.094554c83.911344-83.23135 135.990938-198.518449 135.990938-325.781454C941.876642 205.950391 735.934251 0 482.824228 0 229.698205 0 23.747814 205.950391 23.747814 459.076413c0 253.142022 205.950391 459.060414 459.076414 459.060414 103.079195 0 198.334451-34.167733 275.037851-91.759283l188.342529 188.342528c6.183952 6.183952 14.279888 9.271928 22.383825 9.271928s16.199873-3.087976 22.391825-9.271928a31.655753 31.655753 0 0 0 0-44.77565zM87.06732 459.076413c0-218.222295 177.534613-395.748908 395.756908-395.748908 218.206295 0 395.732908 177.526613 395.732908 395.748908 0 218.198295-177.526613 395.740908-395.732908 395.740909-218.222295 0-395.756908-177.542613-395.756908-395.740909z' fill='#4277ab' p-id='1181'></path>
                   </svg>
               </div>
           </div>
            <div class='list-box mt10'>
                <div class='group-inner dk' id='checkItemGroup'></div>
                <div class='group-inner dn' id='notCheckGroup'></div>
                <div class='group-inner dn' id='searchGroup'></div>
            </div>
            <div class='excel-name pd20'>
                <p class='mb10'>excel名称</p>
                <input class='formControl'>
                <div class='tc mt29'>
                    <button class='btn btnPrimay mr20 save'>编辑</button>
                    <button class='btn btnPrimay mr20 newExcel'>新增</button>
                    <button class='btn btnGray cancel' style='color:#999999'>取消</button>
                </div>
            </div>
       </div> 
       <!-- 快捷编辑模块 结束-->
    `);

let $addExcelHtml =
    $(`
       <div style='width:100%'>
           <div class='title-box fs16 primary pb12 clearfloat'>定制excel <i class='iconfont icon-chacha closeEdit'></i></div>
           <div class='main-wrapper'>
               <div class='uploadTemp'>
                   <h4>上传模板</h4>
                   <div style='position: relative'><input type='text' readonly> <span id='uploadtemp'>选择</span><label>上传文件大小不能超过100KB</label>  </div>
               </div>
               <div class='preview-excel table-cont'></div>
               <div class='basic-config-wrap'>
                   <h4>基本配置</h4>
                   <ul class='clearFloat'>
                       <li><span>excel名称</span><input type='text' class='excelname'></li>
                       <li><span>标题行</span><input type='text' class='titlerow'></li>
                       <li><span>数据开始行</span><input type='text' class='startrow'></li>
                       <li><span>数据开始列</span><input type='text' class='limitcol'></li>
                   </ul>
               </div>
               <div class='getvalue-config-wrap clearFloat'>
                   <h4>取值配置</h4>
                   <div class='excel-view fl'>
                       <div class='select-scene clearFloat '>
                           <span>选择场景</span>
                           <input type='text' id='selectScene'> <i class='iconfont icon-navup'></i>
                           <div class='scene-list'></div>
                       </div>
                       <div class='table-wrap'>
                           <table cellspacing='0' cellpadding='0' border='0'>
                               <thead>
                                   <tr>
                                       <th style='width:40px'>序号</th>
                                       <th style='width:130px'>excel字段</th>
                                       <th style='width:220px'>取值字段</th>
                                       <th>顺序调整</th>
                                   </tr>
                               </thead>
                               <tbody></tbody>
                           </table>
                       </div>
                   </div>
                   <div class='excel-config fr'>
                       <div class="item checkbox" style="float: right;position: relative;top:2px;z-index: 9">
                            <span class="set-num" name="number"><i class='iconfont icon-fuxuankuang1'></i>设为序号列</span>
                            <span class="set-fixedValue" name="fixedval"><i class='iconfont icon-fuxuankuang1'></i>设置固定值</span>
                            <span class="set-merge" name="merge"><i class='iconfont icon-fuxuankuang1'></i>是否合并</span>
                       </div>
                       <div class='item mb10 mt10'><h6>字段名称</h6><input name='filedname' type='text'></div>
                       <div class='item mb10 get-filed'><h6>取值字段</h6><input name='getfiled' type='text'> <i class='iconfont icon-navup'></i> <div class='drop-down'></div> </div>
                       <div class='item mb10 get-fixedval' style='display: none;'><h6>固定值</h6><input name='fixedval' type='text'></div>
                       <div class='item mb10 change-format'><h6 >格式转换 </h6><input type='text' readonly><i class='iconfont icon-navup'></i><div class='func-list'></div></div>
                       <div class="item mb10 get-mergelevel" style='display: none;'><h6>合并等级</h6><input type="text" name="mergelevel"><i class="iconfont icon-navup"></i><div class="mergelevel-list"></div></div>
                       <div class='dn'>
                           <p class='remark mb10'>备注：</p>
                           <div class='format'>支持格式：<span><i class='iconfont icon-fuxuankuang1'></i>拼音转换</span><span><i class='iconfont icon-fuxuankuangxuanzhong'></i>英文数字</span></div>
                       </div>
                       <div class='item merge clearFloat mt20 dn'>
                           <div class='fl' style='width:50%'><h6>排序序号</h6><input type='text'></div>
                           <div class='fl' style='width:50%'><h6>合并展示</h6><input type='text'></div>
                       </div>
                   </div>
               </div>
           </div>    
           <div class='btn-box'><button name='submit'>提交配置</button><button name='cancel' class='closeEdit'>取消</button></div>
       </div>
    `);
//定义全局变量
let modelUrl = ''; //模板上传以后返回的url
let columnList = [];
let initOpt = {
    scene: '', //场景编号
    scenename: '', //场景名称
    excelname: '', //excel名称
    isCustom: 0,//是否为定制  1:定制 0:非定制
    titlerow: 1,  //跨行
    limitcol: 1,  //跨列
};
let resultItem = []; //所有已选择条件

let MyApplication = {
    //创建元素
    element: function (ele, className, id, text) {
        let $dom = document.createElement(ele);
        $dom.className = className || '';
        $dom.id = id || '';
        $($dom).html(text);
        return $dom;
    },
    //提交定制Excel配置
    submitConfigData: function (type) {
        let excelcode = $('.basic-config-wrap .excelname').attr('code');
        let excelnameCn = $('.basic-config-wrap .excelname').val();
        let titlerow = $('.basic-config-wrap .titlerow').val();  //标题行
        let startrow = $('.basic-config-wrap .startrow').val();  //开始行
        let limitCol = $('.basic-config-wrap .limitcol').val();  //开始列
        let scenename = $('#selectScene').val();
        let scenecode = $('#selectScene').attr('code');
        let modenName = $('.uploadTemp input').val();
        let columnArray = [];
        let columnJson = {
            numbercode: '',
            nameCn: '',
            alias: '',
            sort: 0,
            func: ''
        };

        let $trList = Array.from($('.table-wrap tbody tr'));
        $trList.forEach(function (t) {
            let alias = $(t).find('.value').attr('alias');  //别名
            let nameCn = $(t).find('.getvalue').text();     //取值字段
            let numbercode = $(t).find('.getvalue').attr('code');
            let sort = parseInt($(t).find('.columnIndex').text());
            let Funct = $(t).find('.getvalue').attr('func');
            let index = $(t).attr('isindex');
            let fixedval = $(t).attr('fixedval');
            let mergeval = $(t).attr('data-mergetype');
            let ismerge = $(t).attr('ismerge');
            columnJson = {
                numberCode: numbercode ? numbercode : '',
                nameCn: nameCn,
                alias: alias ? alias : $(t).find('.value').text(),
                sort: sort,
                func: Funct ? Funct : '',
                indexBasis: '',
                isIndex: index ? parseInt(index) : 0,
                fixedValue: fixedval ? fixedval : '',
                mergeType: mergeval,
                isMerge: ismerge
            };
            columnArray.push(columnJson);
        });

        xyzAjax({
            url: '../Datasup_CustomExcelWS/addCustomExcel.do',
            data: {
                excelCode: excelcode,
                excelNameCn: excelnameCn,
                scene: scenecode,
                sceneName: scenename,
                customModelUrl: modelUrl,
                limitRow: parseInt(startrow) - 1,
                limitCol: parseInt(limitCol) - 1,
                titleRow: parseInt(titlerow),
                pubPriv: 2,
                columnJson: JSON.stringify(columnArray),
                customModelFilName: modenName,
            },
            success: function (data) {
                if (data.status === 1) {
                    if (type === 'add') {
                        top.$.messager.alert("警告", "新增成功", "warning",'success');
                        $('#customExcel .closeEdit').click();
                    } else if (type === 'edit') {
                        top.$.messager.alert("警告", "编辑成功", "warning",'success');
                        let excelcode = data.content;
                        $('#excelCode').val(excelcode);
                        $('#excelVal').val(excelnameCn);

                    }
                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                }
            }
        })
    },
    //去重
    unique: function (arr) {
        let res = new Map();
        return arr.filter((a) => !res.has(a.numberCode) && res.set(a.numberCode, 1))
    },
    //上传模板
    uploadFileFN: function (fn) {
        function getUUID() {
            let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [];
            let i;
            let r;
            for (i = 0; i < 32; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        }

        //获取token
        function getToken(callback) {
            //获取token
            let uploadToken;
            let ieFlag = navigator.userAgent.indexOf("MSIE") !== -1;
            let xhr = new XMLHttpRequest();
            if (ieFlag) {
                xhr = new XDomainRequest();
            }
            if (!xhr) {
                return;
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        uploadToken = xhr.responseText;
                    } else {
                        uploadToken = '';
                    }
                    if (callback) {
                        callback(uploadToken)
                    }
                }
            };
            let paramArray = new Array();
            let param = paramArray.join('&').replace('%20', '+');
            xhr.open("POST", 'https://toolapi.maytek.cn/qt2', true);
            if (!ieFlag) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
            xhr.send(param);
        }

        //上传图片
        function uploadfile(file, MxEditorToken, callback) {
            let qiniuUrl = 'https://upload.qiniup.com';
            let errCodeMsg = {
                'code400': '报文构造不正确或者没有完整发送。',
                'code401': '上传凭证无效。',
                'code403': '上传文件格式不正确。',
                'code413': '上传文件过大。',
                'code579': '回调业务服务器失败。',
                'code599': '服务端操作失败。',
                'code614': '目标资源已存在。'
            };

            let size = MyApplication.bytesToSize(file.size).split('KB')[0];
            if(size > 100 ){
                top.$.messager.alert("提示", '文件大小不能超过100KB', "warning");
                return;
            }

            if (MxEditorToken.indexOf('error') > -1 || MxEditorToken === '') {
                top.$.messager.alert("提示", 'token获取失败,请联系管理员', "warning");
                return;
            }

            //构建xhr上传表单参数
            let form = new FormData();
            form.append('file', file);
            form.append('token', MxEditorToken);
            form.append('x:folder', 'default');

            //优化自定义文件名模式
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
            form.append('key', 'default' + '/' + dd + '/' + getUUID() + '/' + file.name);

            //构建xhr对象
            let xhr = new XMLHttpRequest();
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
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        let resultData = xhr.responseText;
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
                        let resultData = {
                            status: 0,
                            msg: errCodeMsg['code' + xhr.status] ? errCodeMsg['code' + xhr.status] : xhr.statusText
                        };
                        callback(resultData);
                    }
                }
            };
            xhr.send(form);//发射
        }

        let ipt = document.createElement('input');
        ipt.style = 'display:none';
        ipt.type = 'file';
        ipt.id = 'uploadExcel';
        ipt.accept = "application/vnd.ms-excel,application/msexcel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        let body = document.querySelector('body');
        body.appendChild(ipt);
        ipt.onchange = function (event) {
            if (!event.target || !event.target.files) {
                return
            }
            let files = event.target.files[0];
            getToken(function (token) {
                uploadfile(files, token, fn)
            })
        };
        ipt.click();
    },
    //字节转换
    bytesToSize:function(bytes){
        if (bytes === 0) return '0 B';
        let k = 1024;
        let sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        let size = Math.round(bytes / Math.pow(k, i))+ ' ' + sizes[i];
        return size;
    },

    //数组元素交换位置
    swapArray: function (arr, idx1, idx2) {
        arr[idx1] = arr.splice(idx2, 1, arr[idx1])[0];
        return arr;
    },
    //配置excel列值
    setColValue: function (currRow) {
        let $parent = $('.excel-config');
        let isindex = $(currRow).attr('isindex'); //序列号属性
        let isfixed = $(currRow).attr('isfixed'); //固定值属性
        let ismerge = $(currRow).attr('ismerge'); //合并属性
        let mergevalue = $(currRow).attr('data-mergetype');  //合并值
        let colfiled = $(currRow).find('.value');  //excel字段
        let value = $(currRow).find('.value').attr('alias');  //别名属性
        let getvalue = $(currRow).find('.getvalue');  //取值字段
        let namecn = getvalue.text();
        let code = $(currRow).find('.getvalue').attr('code'); //字段编号属性

        let $number = $parent.find('.set-num'); //设为序列号
        let $fixed = $parent.find('.set-fixedValue'); //设为固定值
        let $merge = $parent.find('.set-merge'); //设为固定值
        let $filedname = $parent.find('input[name="filedname"]');  //字段名称
        let $fixedval = $parent.find('.get-fixedval'); //固定值
        let $getfiled = $parent.find('.get-filed'); //取值字段
        let $changeformat = $parent.find('.change-format'); //格式转换
        let $mergelevel = $parent.find('.get-mergelevel'); //合并等级
        let $checkspan = $parent.find('.checkbox').find('span');
        let func = $(currRow).find('.getvalue').attr('func');
        let $funclist = $parent.find('.func-list');
        let itemArray = $parent.find('.drop-down').find('li');
        let getvalfiled = $getfiled.find('input');

        /*   if (func === undefined || '') { //格式转换编号
               $funclist.empty();
               $changeformat.find('input').val('')
           }*/
        value !== undefined ? $filedname.val(value) : $filedname.val(colfiled.text());
        namecn !== undefined ? getvalfiled.val(namecn) : getvalfiled.val('');
        if(!code){
            $changeformat.hide();
            $funclist.empty();
            $changeformat.find('input').val('');
        }

        //监听查询
        getvalfiled.change();
        $mergelevel.find('input[name="mergelevel"]').change();

        Array.from($checkspan).forEach(function (i) {
            $(i).off('click').on('click', function () {
                let $icon = $(this).find('i');
                let $sibings = $(this).siblings().find('i');
                let attr = $(this).attr('name');
                let isCheck = MyApplication.isClass($icon, 'icon-fuxuankuang1');
                //监听查询
                getvalfiled.change();
                if (isCheck) {
                    $icon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                    $sibings.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                    $getfiled.hide();
                    $changeformat.hide();
                    getvalue.text('');
                    getvalue.attr({
                        'code': '',
                        'func': ''
                    });
                    getvalfiled.val('');
                    Array.from(itemArray).forEach(function (e) {
                        let icon = $(e).find('.iconfont');
                        icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                    });
                    if (attr === 'number') {
                        $fixedval.show();
                        $mergelevel.hide();
                        $(currRow).attr('isindex', 1);
                        $(currRow).siblings().attr('isindex', 0);
                        $(currRow).attr('isfixed', 0);
                        $(currRow).attr('ismerge', 0);
                    } else if (attr === 'fixedval') {
                        $fixedval.show();
                        $mergelevel.hide();
                        $(currRow).attr('isfixed', 1);
                        $(currRow).siblings().attr('isfixed', 0);
                        $(currRow).siblings().attr('fixedval', '');
                        $(currRow).attr('isindex', 0);
                        $(currRow).attr('ismerge', 0);
                    } else if (attr === 'merge') {
                        $fixedval.hide();
                        $mergelevel.show();
                        $(currRow).attr('ismerge', 1);
                        $(currRow).siblings().attr('ismerge', 0);
                        $(currRow).siblings().attr('data-mergetype', '');
                        $(currRow).attr('isindex', 0);
                        $(currRow).attr('isfixed', 0);
                        $(currRow).attr('fixedval', '');
                        $('.get-fixedval').find('input').val('')
                    }
                } else {
                    $icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                    $(currRow).attr('isindex', 0);
                    $(currRow).attr('isfixed', 0);
                    $(currRow).attr('ismerge', 0);
                    $(currRow).attr('fixedval', '');
                    $(currRow).attr('data-mergetype', '');
                    $fixedval.hide();
                    $mergelevel.hide();
                    $getfiled.show();
                    if (!getvalfiled.val()) {
                        $changeformat.hide();
                        $changeformat.find('input').val('');
                        $funclist.empty();
                    } else {
                        if ($funclist[0].children.length > 0) {
                            $changeformat.show();
                            $('.excel-config .func-list').hide();
                            $funclist.hide();
                        }
                    }

                }

            })
        });

        //将左边表格的初始值，呈现在右边配置区域内
        if (isindex === '1') {
            $number.click();
            $fixedval.show();
            $mergelevel.hide();
            $getfiled.hide();
            $changeformat.hide();
            $fixedval.find('input').val($(currRow).attr('fixedval'));
        } else if (isfixed === '1') {
            $fixed.click();
            $fixedval.show();
            $mergelevel.hide();
            $getfiled.hide();
            $changeformat.hide();
            $fixedval.find('input').val($(currRow).attr('fixedval'));
        } else if (ismerge === '1') {
            $merge.click();
            $mergelevel.show();
            $fixedval.hide();
            $getfiled.hide();
            $changeformat.hide();
        } else if (isindex === '0' && isfixed === '0' && ismerge === '0') {
            $getfiled.show();
            $(currRow).attr('fixedval', '');
            $(currRow).attr('data-mergetype', '');
            $fixedval.find('input').val('');
            $mergelevel.hide();
            $fixedval.hide();
            Array.from($checkspan).forEach(function (i) {
                let $icon = $(i).find('i');
                $icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
            });
        }

        //选择取值字段
        Array.from(itemArray).forEach(function (e) {
            let currname = '';
            let currcode = '';
            let $itemIcon = $(e).find('i.item');
            if (code === $(e).attr('code')) {
                $itemIcon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                if(!func){
                    $changeformat.find('input').val('');
                }
                //格式转换
                let $hidewrap = $(e).find('.func-wrap');
                $funclist.html($hidewrap.html());
                $funclist[0].children.length > 0 ? $changeformat.show() : $changeformat.hide();
                let arr = Array.from($funclist.find('span'));
                arr.forEach(function (f) {
                    let $icon = $(f).find('i');
                    if ($(f).attr('value') === func) {
                        $changeformat.find('input').val($(f).text());
                        $icon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                    }
                    f.addEventListener('click', function () {
                        let child = $(this).children();
                        MyApplication.hasclass(child);
                        $changeformat.find('.func-list').slideDown(150);
                        $changeformat.find('input').val($(this).text());
                        if ($(child).hasClass('icon-fuxuankuangxuanzhong')) {
                            $changeformat.find('input').val($(this).text());
                            getvalue.attr({
                                'func': $(child).parent().attr('value'),
                            });
                        } else {
                            $changeformat.find('input').val('');
                            getvalue.attr('func', '');
                        }
                    })
                })
            } else {
                $itemIcon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                /*   $funclist.empty();
                   $changeformat.hide();*/
            }
            e.addEventListener('click', function () {
                $funclist.empty();
                let $currIcon = $(this).find('i.item');
                if ($currIcon.hasClass('icon-fuxuankuangxuanzhong')) {
                    currname = $currIcon.next().text(); //当前选项的text
                    currcode = $(this).attr('code'); //当前选项的值
                    if (code !== currcode) {
                        $changeformat.find('input').val('');
                        getvalue.attr('func', '');
                    }
                    if ($(currRow).hasClass('active')) {
                        //左侧取值字段配置
                        getvalfiled.val(currname);
                        getvalue.text(currname);
                        getvalue.attr('code', currcode);
                        //格式转换下拉框
                        let $hidemain = $(e).find('.func-wrap');
                        $funclist.html($hidemain.html());
                        $funclist[0].children.length > 0 ? $changeformat.show() : $changeformat.hide();
                        let funcArray = Array.from($funclist.find('span'));
                        funcArray.forEach(function (s1) {
                            let $icon = $(s1).find('i');
                            $icon.off('click').on('click', function () {
                                if ($(this).hasClass('icon-fuxuankuang1')) {
                                    $(this).removeClass('icon-fuxuankuang1').addClass('icon-fuxuankuangxuanzhong');
                                    $(this).parent().siblings().find('i').removeClass('icon-fuxuankuangxuanzhong').addClass('icon-fuxuankuang1');
                                    getvalue.attr({
                                        'func': $(this).parent().attr('value'),
                                    });
                                    $changeformat.find('input').val($(this).parent().text());
                                } else {
                                    $(this).removeClass('icon-fuxuankuangxuanzhong').addClass('icon-fuxuankuang1');
                                    $icon.removeClass('icon-fuxuankuangxuanzhong').addClass('icon-fuxuankuang1');
                                    getvalue.attr('func', '');
                                    $changeformat.find('input').val('')
                                }
                            })
                        })
                    }
                } else {
                    if ($(currRow).hasClass('active')) {
                        getvalfiled.val('');
                        getvalfiled.change();
                        getvalue.attr({
                            'code': '',
                            'func': ''
                        });
                        getvalue.text('');
                        $changeformat.hide();
                        $changeformat.find('input').val('');
                    }
                }
                //监听查询
                getvalfiled.change();
            }, false)
        });
        //合并等级
        let $mergelist = $mergelevel.find('.mergelevel-list').find('li');
        Array.from($mergelist).forEach(function (e) {
            let attr = $(e).attr('data-value');
            let text = '';
            let value = '';
            let $icon = $(e).find('.iconfont');
            if (attr === mergevalue) {
                text = $(e).find('span').text();
                $mergelevel.find('input').val(text);
                $icon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
            } else {
                $icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
            }


            e.addEventListener('click', function () {
                let $currIcon = $(this).find('.iconfont');
                if ($currIcon.hasClass('icon-fuxuankuangxuanzhong')) {
                    text = $(this).find('span').text();
                    value = $(this).attr('data-value');
                    if ($(currRow).hasClass('active')) {
                        $mergelevel.find('input').val(text);
                        $(currRow).attr('data-mergetype', value);
                    }
                } else {
                    if ($(currRow).hasClass('active')) {
                        $mergelevel.find('input').val('');
                        $(currRow).attr('data-mergetype', '');
                    }
                }
                //监听查询
                $mergelevel.find('input[name="mergelevel"]').change();
            }, false)

        });

        //设置固定值
        let fixedValinput = $fixedval.find('input');
        fixedValinput.off('input').on('input', function () {
            $(currRow).attr('fixedval', fixedValinput.val())
        });

        //设置别名
        $filedname.off('input').on('input', function () {
            colfiled.attr('alias', $filedname.val())
        });


    },
    //生成配置表格预览
    createTableView: function (dataList, startRow, startCol) {
        let $tbody = $('.excel-view tbody');
        let col = startCol - 1;
        if (dataList !== undefined) {
            let length = dataList.length;
            $tbody.empty();
            dataList.forEach(function (r, idx) {
                if (idx >= col) {
                    let $tr = $(`<tr></tr>`);
                    $tr.attr({
                        'isindex': '0',
                        'ismerge': '0',
                        'isfixed': '0',
                        'fixedval': '',
                    });
                    let numindex = idx + 1 - startCol + 1; //序号
                    let $td = $(`<td class="columnIndex" style="width:40px">${numindex}</td><td class="value" style="width: 130px;">${r.alias === undefined ? r.value : r.alias}</td><td class="getvalue" style="width: 220px"></td><td class="icon"><i class="iconfont icon-iconzhenghe08"></i><i class="iconfont icon-iconxia-copy"></i></td>`);
                    if (columnList.length > 0 && startRow === initOpt.titlerow && startCol === initOpt.limitcol) {
                        columnList.forEach(function (c, i) {
                            if (numindex === i + 1) {
                                c.isIndex === 1 ? $tr.attr('isindex', '1') : $tr.attr('isindex', '0');
                                c.isMerge === 1 ? $tr.attr('ismerge', '1') : $tr.attr('ismerge', '0');
                                c.isIndex === 0 && c.fixedValue.length > 0 ? $tr.attr('isfixed', '1') : $tr.attr('isfixed', '0');
                                c.fixedValue.length > 0 ? $tr.attr('fixedval', c.fixedValue) : $tr.attr('fixedval', '');
                                c.mergeType.length > 0 ? $tr.attr('data-mergeType', c.mergeType) : $tr.attr('data-mergeType', '');

                                $($td[1]).attr('alias', c.alias);
                                $($td[2]).attr('code', c.colum);
                                $($td[2]).attr('func', c.func);
                                $($td[2]).text(c.columNameCn);
                            }

                        })
                    }
                    $tr.append($td);

                    //交换tr位置
                    let $up = $tr.find('.icon-iconzhenghe08');
                    let $down = $tr.find('.icon-iconxia-copy');
                    //上移
                    $($up).off('click').on('click', function () {
                        let columnindex = parseInt($(this).parent().parent().find('.columnIndex').text()) - 1;
                        if (columnindex !== 0) {
                            let trArray = Array.from($tbody.find('tr'));
                            let newtable = MyApplication.swapArray(trArray, columnindex, columnindex - 1);
                            newtable.forEach(function (d, i) {
                                $(d).find('.columnIndex').text(i + 1);
                                $tbody.append($(d));
                            });
                        } else {
                            top.$.messager.alert("警告", "已经处于置顶，无法上移", "warning");
                        }

                    });
                    //下移
                    $($down).off('click').on('click', function () {
                        let columnindex = parseInt($(this).parent().parent().find('.columnIndex').text()) - 1;
                        if (columnindex + 1 !== length) {
                            let trArray = Array.from($tbody.find('tr'));
                            let newtable = MyApplication.swapArray(trArray, columnindex, columnindex + 1);
                            newtable.forEach(function (d, i) {
                                $(d).find('.columnIndex').text(i + 1);
                                $tbody.append($(d));
                            });
                        } else {
                            top.$.messager.alert("警告", "已经处于置底，无法下移", "warning");
                        }
                    });

                    $td.off('click').on('click', function () {
                        if ($($tr).hasClass('active')) {
                            $($tr).removeClass('active');
                            $('.excel-config .drop-down').slideUp(100);
                        } else {
                            $($tr).addClass('active');
                            $($tr).siblings().removeClass('active');
                            MyApplication.setColValue($tr);
                        }
                    });
                    $tbody.append($tr);
                }

            });
        }
    },
    //配置列值
    configColumnVal: function (content) {
        let $limitrow = $('.basic-config-wrap .titlerow').val();
        let $limitcol = $('.basic-config-wrap .limitcol').val();
        let reg = /^[1-9]\d*$/;
        if (!reg.test($limitrow) || !reg.test($limitcol)) {
            top.$.messager.alert("警告", '标题行和开始列只能输入数字！', "warning");
            return
        }

        let startrow = parseInt($limitrow);
        let startcol = parseInt($limitcol);
        let dataList = content[startrow - 1];

        MyApplication.createTableView(dataList, startrow, startcol);

        $('.basic-config-wrap .titlerow,.basic-config-wrap .limitcol').on('input', function () {
            MyApplication.configColumnVal(content);
        });

    },
    //解析上传模板url
    analysisExcelTemplate: function (filename, modename, fileurl) {
        let $inputval = $(".uploadTemp input");
        $('.basic-config-wrap .excelname').val(modename);
        $inputval.val(filename);
        columnList = [];
        xyzAjax({
            url: "../Datasup_CustomExcelWS/analysisExcelTemplate.do",
            data: {
                url: fileurl
            },
            success: function (data) {
                if (data.status === 1) {
                    let content = data.content;
                    MyApplication.modepreView(content);
                    MyApplication.getSceneList();
                } else {
                    top.$.messager.alert("警告", data.msg, "warning")
                }

            }
        })
    },
    //模板预览
    modepreView: function (data) {
        let configData = data.dataList;
        let $box = $('#customExcel .preview-excel');
        let $table = $(`<table class="table" cellpadding="0" cellspacing="0"></table>`);
        let $tbody = $(`<tbody></tbody>`);
        $box.html($table);
        $table.html($tbody);
        let trColum = $(`<tr></tr>`);
        for (let i = 0; i <= data.maxCellIndex; i++) {
            let $td = $(`<td style="text-align: center;background-color: #e2ebf4;">${i}</td>`);
            trColum.append($td)
        }
        $tbody.append(trColum);

        configData.forEach(function (item, i) {
            let $tr = $(`<tr><td style="text-align: center;background-color: #e2ebf4;">${i + 1}</td></tr>`);
            $tbody.append($tr);
            item.forEach(function (t, idx) {
                if (t.merge !== '') {
                    let colend = t.merge.col_end;   //结束列
                    let colstart = t.merge.col_start;  //开始列
                    let rowend = t.merge.row_end;   //结束行
                    let rowstart = t.merge.row_start;    //开始行
                    let $td = $(`<td>${t.value}</td>`);
                    if (idx === colstart) {  //合并列
                        $td.attr('colspan', colend - t.merge.col_start + 1);
                        $tr.append($td);
                        $td.nextAll().remove();
                    }
                    let rowcout = rowend - rowstart + 1 <= 0 ? 1 : rowend - rowstart + 1;
                    $td.attr('rowspan', rowcout);
                    $td.css('line-height', rowcout > 1 ? 40 * rowcout + 'px' : '');
                    $td.parent().addClass('merge-row');
                } else {
                    let $td = $(`<td>${t.value}</td>`);
                    $tr.append($td);
                }
            })

        });

        //绘制合并行
        let mergerow = Array.from($tbody.find('.merge-row'));
        mergerow.forEach(function (m) {
            let nexttr = Array.from($(m).next().find('td'));
            nexttr.forEach(function (n) {
                if (n.hasAttribute('rowspan')) {
                    let row = parseInt($(n).attr('rowspan'));
                    if (row > 1 && $(n).text() === '') {
                        $(n).remove();
                    }
                }
            });
        });

        MyApplication.configColumnVal(configData);
    },
    //获取场景列表
    getSceneList: function () {
        xyzAjax({
            url: '../Datasup_ListWS/getSceneList.do',
            data: {},
            success: function (data) {
                if (data.status === 1) {
                    let dataList = data.content;
                    let $parent = $('.select-scene .scene-list');
                    let $icon = $('.select-scene .icon-navup');
                    $('body').on('click', function () {
                        $parent.slideUp(150)
                    });

                    $icon.off('click').on('click', function () {
                        $parent.slideToggle(150);
                        event.stopPropagation();
                    });

                    let $ul = $(`<ul style="padding: 0"></ul>`);
                    $parent.html($ul);
                    let createDropList = function (list) {
                        let codeOld = $('#selectScene').attr('code');
                        list.forEach(function (e) {
                            let $li = $(`<li value="${e.value}">${e.text}</li>`);
                            let val = $li[0].getAttribute('value');
                            if (codeOld === val) {
                                $li.css({
                                    'color': '#3b72a8',
                                    'fontSize': '14px',
                                    'fontWeight': 'bold',
                                    'backgroundColor': '#e2ebf4',
                                    'borderRadius': '5px',
                                });
                                $('#selectScene').val(e.text);
                            }
                            $li.off('click').on('click', function () {
                                let codeNew = $('#selectScene').attr('code');
                                let value = this.getAttribute('value');
                                if (codeNew === '') {
                                    $('#selectScene').val(e.text);
                                    $('#selectScene').attr('code', e.value);
                                    initOpt.scene = e.value;
                                    initOpt.scenename = e.text;
                                    $parent.slideUp(150);
                                    $(this).css({
                                        'color': '#3b72a8',
                                        'fontSize': '14px',
                                        'fontWeight': 'bold',
                                        'backgroundColor': '#e2ebf4',
                                        'borderRadius': '5px',
                                    });
                                    $(this).siblings().css({
                                        'color': '',
                                        'fontSize': '',
                                        'fontWeight': '',
                                        'backgroundColor': '',
                                        'borderRadius': '',
                                    });
                                    MyApplication.getColumList(1);
                                } else if (codeNew === value) {
                                    $('#selectScene').val(e.text);
                                } else if (codeNew !== value) {
                                    let r = confirm("切换场景将会清除当前的配置数据，是否确认切换场景？");
                                    if (r === true) {
                                        $(this).css({
                                            'color': '#3b72a8',
                                            'fontSize': '14px',
                                            'fontWeight': 'bold',
                                            'backgroundColor': '#e2ebf4',
                                            'borderRadius': '5px',
                                        });
                                        $(this).siblings().css({
                                            'color': '',
                                            'fontSize': '',
                                            'fontWeight': '',
                                            'backgroundColor': '',
                                            'borderRadius': '',
                                        });
                                        $('#selectScene').val(e.text);
                                        $('#selectScene').attr('code', e.value);
                                        initOpt.scene = e.value;
                                        initOpt.scenename = e.text;
                                        $parent.slideUp(150);
                                        let $trarr = Array.from($('.getvalue-config-wrap .table-wrap tbody').find('tr'));
                                        $trarr.forEach(function (t) {
                                            $(t).attr('isindex', '0');
                                            $(t).attr('isfixed', '0');
                                            $(t).attr('ismerge', '0');
                                            $(t).attr('fixedval', '');
                                            $(t).attr('data-mergetype', '');
                                            $(t).find('.getvalue').text('');
                                            $(t).find('.getvalue').removeAttr('code');
                                            $(t).find('.getvalue').removeAttr('Funct');
                                            $(t).find('.value').removeAttr('alias');
                                        });
                                        $('.excel-config .set-num').find('i').addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                                        $('.excel-config .get-filed').show();
                                        $('.excel-config .func-list').empty();
                                        $('.excel-config .change-format').hide();
                                        MyApplication.getColumList(1);
                                        MyApplication.getMergeLevel();
                                    }
                                }

                            });
                            $ul.append($li);
                        });
                    };
                    createDropList(dataList);
                    MyApplication.getMergeLevel();

                    //选择场景输入框检索
                    $('#selectScene').on('input', function () {
                        let inputVal = $('#selectScene').val();
                        let current = [];
                        $parent.slideDown(150);
                        $ul.empty();
                        dataList.forEach(function (d) {
                            if (d.text.indexOf(inputVal) !== -1) {
                                current.push(d);
                            }
                        });
                        createDropList(current);
                    });

                }

                else {
                    top.$.messager.alert("提示", data.msg, "info");
                }
            }
        });
        //格式转换下拉框
        $('.change-format .icon-navup').off('click').on('click', function () {
            event.stopPropagation();
            $('.change-format .func-list').slideToggle(100);
        });
    },
    //获取场景下所有可用的列
    getColumList: function (type) {
        let itemData = [];  //所有条件
        let excelCode = $('#excelCode').val();
        xyzAjax({
            url: "../Datasup_ExcelWS/getColumList.do",
            data: {
                scene: initOpt.scene,
                excel: '',
            },
            success: function (data) {
                if (data.status === 1) {
                    itemData = data.content;
                    MyApplication.renderEditData(itemData, type);
                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                }
            }
        })
    },
    //渲染编辑页面
    renderEditData: function (obj, type) {
        if (type === 0) {  //普通类型excel
            let num = 0; //记录选择条件时的点击顺序
            let $checkItemGroup = $('#checkItemGroup');
            let $notCheckGroup = $('#notCheckGroup');
            $('#searchItemInput').val('');
            $checkItemGroup.empty();
            $notCheckGroup.empty();

            let $groupbox = $(`<div class="group-box"></div>`);
            let $groupbox2 = $(`<div class="group-box"></div>`);
            let $allcheck = $(`<span class="all-check"><i class="iconfont icon-fuxuankuangxuanzhong csPointer"></i>全选</span>`);
            let $allcheck2 = $(`<span class="all-check"><i class="iconfont icon-fuxuankuang1 csPointer"></i>全选</span>`);
            $checkItemGroup.append($allcheck);
            $checkItemGroup.append($groupbox);
            $notCheckGroup.append($allcheck2);
            $notCheckGroup.append($groupbox2);


            let result = [];
            let result2 = [];
            obj.forEach(function (e) {
                e.list.forEach(function (item, j) {
                    item.isColum = 0;
                    resultItem.forEach(function (code, c) {
                        if (code.colum === item.numberCode) {
                            item.checked = true;
                            item.isColum = 1;
                        }
                    });
                });
                result = e.list.filter(item => item.isColum === 1);
                result2 = e.list.filter(item => item.isColum === 0);
                if (result.length > 0) {
                    let $titleHtml = $(`<div class='group-item dk' type="${e.name}"><p class='item-title'>${e.name}</p></div>`);
                    let $groupCnHtml = $(`<span class='group-name'>${e.name}</span>`);
                    $groupCnHtml.on('click',function () {
                        let name = $(this).text();
                        let $parent = $(this).parent().parent();
                        let grouparr = Array.from($parent.find('.group-item'));

                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $parent.find('.group-item').addClass('dk');
                            $parent.find('.group-item').removeClass('dn');

                        } else {
                            $(this).addClass('active');
                            $(this).siblings().removeClass('active');
                            grouparr.forEach(function (item) {
                                if ($(item).attr('type') === name) {
                                    $parent.find('.group-item').addClass('dn');
                                    $parent.find('.group-item').removeClass('dk');
                                    $(item).addClass('dk');
                                    $(item).removeClass('dn');
                                }
                            })
                        }
                    });

                    let $ul = $(`<ul class='clearfloat'></ul>`);
                    $titleHtml.append($ul);
                    $groupbox.append($groupCnHtml);
                    result.forEach(function (item) {
                        let $li = $(`<li code="${item.numberCode}"> <i class='iconfont icon-fuxuankuangxuanzhong csPointer'></i>${item.alias === "" ? item.columnName : item.alias}</li>`);
                        let $icon = $li.find('i');
                        $icon.removeClass('icon-fuxuankuang1');
                        $ul.append($li);
                    });
                    $checkItemGroup.append($titleHtml);
                    $checkItemGroup.addClass('dk');
                    $checkItemGroup.removeClass('dn');
                }
                if (result2.length > 0) {
                    let $titleHtml2 = $(`<div class='group-item dk' type="${e.name}"><p class='item-title'>${e.name}</p></div>`);
                    let $groupCnHtml2 = $(`<span class='group-name'>${e.name}</span>`);
                    $groupCnHtml2.on('click',function () {
                        let name = $(this).text();
                        let $parent = $(this).parent().parent();
                        let grouparr = Array.from($parent.find('.group-item'));
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $parent.find('.group-item').addClass('dk');
                            $parent.find('.group-item').removeClass('dn');

                        } else {
                            $(this).addClass('active');
                            $(this).siblings().removeClass('active');
                            grouparr.forEach(function (item) {
                                if ($(item).attr('type') === name) {
                                    $parent.find('.group-item').addClass('dn');
                                    $parent.find('.group-item').removeClass('dk');
                                    $(item).addClass('dk');
                                    $(item).removeClass('dn');
                                }
                            })
                        }
                    });
                    let $ul2 = $(`<ul class='clearfloat'></ul>`);
                    $titleHtml2.append($ul2);
                    $groupbox2.append($groupCnHtml2);
                    result2.forEach(function (item) {
                        let $li = $(`<li code="${item.numberCode}"> <i class='iconfont icon-fuxuankuang1 csPointer'></i>${item.alias === "" ? item.columnName : item.alias}</li>`);
                        let $icon = $li.find('i');
                        $icon.removeClass('icon-fuxuankuangxuanzhong');
                        $ul2.append($li);
                    });
                    $notCheckGroup.append($titleHtml2);
                    $notCheckGroup.addClass('dn');
                    $notCheckGroup.removeClass('dk')
                }
            });


            let $checkbox = $(".select-group i");
            let checklist = Array.from($checkbox);
            let $inner = $('.group-inner');
            //已选、未选
            checklist.forEach(function (i) {
                if ($(i).attr('id') === 'checked') {
                    $(i).addClass("icon-fuxuankuangxuanzhong").removeClass("icon-fuxuankuang1");
                    $(i).parent().siblings().find('i').addClass("icon-fuxuankuang1").removeClass("icon-fuxuankuangxuanzhong");
                    $inner.addClass('dn').removeClass('dk');
                    $checkItemGroup.addClass('dk').removeClass('dn');
                }
                $(i).off('click').on('click', function () {
                    $inner.addClass('dn').removeClass('dk');
                    if ($(i).hasClass('icon-fuxuankuang1')) {
                        $(i).addClass("icon-fuxuankuangxuanzhong").removeClass("icon-fuxuankuang1");
                        $(i).parent().siblings().find('i').addClass("icon-fuxuankuang1").removeClass("icon-fuxuankuangxuanzhong");
                        if ($(i).attr('id') === 'checked') {
                            $checkItemGroup.addClass('dk').removeClass('dn');
                        } else if ($(i).attr('id') === 'notCheck') {
                            $notCheckGroup.addClass('dk').removeClass('dn');
                        }
                    } else {
                        $(i).addClass("icon-fuxuankuang1").removeClass("icon-fuxuankuangxuanzhong");
                        $(i).parent().siblings().find('i').addClass("icon-fuxuankuangxuanzhong").removeClass("icon-fuxuankuang1");

                        if ($(i).attr('id') === 'checked') {
                            $notCheckGroup.addClass('dk').removeClass('dn');
                        } else if ($(i).attr('id') === 'notCheck') {
                            $checkItemGroup.addClass('dk').removeClass('dn');
                        }
                    }
                });
            });
            //全选
            $('.group-inner .all-check').off('click').on('click', function () {
                let $this = $(this);
                let $icon = $(this).find('i');
                let $groupitem = $this.parent().find('.group-item');
                let groupArr = Array.from($groupitem);
                if ($icon.hasClass('icon-fuxuankuang1')) {
                    $icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                    groupArr.forEach(function (e) {
                        if ($(e).hasClass('dk')) {
                            $(e).find('i').addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                        }
                    })

                } else {
                    $icon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                    groupArr.forEach(function (e) {
                        if ($(e).hasClass('dk')) {
                            $(e).find('i').addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                        }
                    })
                }

            });
            //自由选择
            $("body").off('click', '#editBox .list-box i').on('click', '#editBox .list-box i', function () {
                let $this = $(this);
                let $allItem = $('.group-inner .group-item i');
                let allitem = Array.from($allItem);
                num++;
                $this.parent().attr("colindex", num);
                MyApplication.checkliandong($this, allitem, 'free');
            });
        } else if (type === 1) {  //定制类型excel

            let $dropdown = $('.excel-config .drop-down');
            let $mergeList = $('.get-mergelevel .mergelevel-list');

            $('#customExcel').on('click', function () {
                $dropdown.slideUp(100);
                $mergeList.slideUp(100);
            });
            $(".get-filed input[name='getfiled'],.get-filed .icon-navup").off("click").on("click", function () {
                $dropdown.slideToggle(150);
                event.stopPropagation();
            });
            $(".get-mergelevel input[name='mergelevel'],.get-mergelevel .icon-navup").off("click").on("click", function () {
                $mergeList.slideToggle(150);
                event.stopPropagation();
            });
            $('.excel-view tbody').find('tr').removeClass('active');
            $('.excel-config input[name="filedname"]').val('');
            $('.excel-config input[name="getfiled"]').val('');

            // 渲染取值字段下拉框
            $dropdown.empty();
            let $ul = $(`<ul class="clearFloat"></ul>`);
            $dropdown.append($ul);
            obj.forEach(function (e) {
                e.list.forEach(function (d) {
                    let $li = $(`<li code="${d.numberCode}"><i class="iconfont icon-fuxuankuang1 item"></i><span>${d.columnName}</span></li>`);
                    $li.off('click').on('click', function () {
                        let $icon = $(this).find('i.item');
                        MyApplication.hasclass($icon)
                    });
                    let hidemain = $('<div class="dn func-wrap"></div>');
                    $li.append(hidemain);
                    $ul.append($li);
                    if (d.funcList) {
                        d.funcList.forEach(function (f) {
                            let $item = $(`<span value="${f.funct}"><i class="iconfont icon-fuxuankuang1"></i> ${f.functionName} </span>`);
                            hidemain.append($item);
                        })
                    }
                });

            });


            // 取值字段输入框检索
            let $input = $('.get-filed').find('input');
            let item = $dropdown.find('i.item');
            let itemArray = Array.from(item);
            $input.on('change input', function () {
                let val = $input.val();
                itemArray.forEach(function (e) {
                    $(e).parent().addClass('dn').removeClass('dk');
                    if ($(e).next().text().indexOf(val) !== -1) {
                        $(e).parent().addClass('dk').removeClass('dn');
                    }
                })
            })
        }
    },
    //获取合并等级
    getMergeLevel: function () {
        xyzAjax({
            url: "../Datasup_ListWS/getMergetype.do",
            data: {
                scene: initOpt.scene,
            },
            success: function (data) {
                if (data.status === 1) {
                    let list = data.content;
                    let $mergelevellist = $('.get-mergelevel').find('.mergelevel-list');
                    let $mergeinput = $('.get-mergelevel').find('input');
                    let $ul = $(`<ul></ul>`);
                    list.forEach(function (i) {
                        let $li = $(`<li data-value="${i.value}"><i class="iconfont icon-fuxuankuang1"></i><span>${i.text}</span></li>`);
                        $li.off('click').on('click', function () {
                            let $icon = $(this).find('i');
                            MyApplication.hasclass($icon)
                        });
                        $ul.append($li);

                    });
                    $mergelevellist.html($ul);

                    // 合并等级输入框检索
                    let itemArray = Array.from($mergelevellist.find('.iconfont'));
                    $mergeinput.on('change input', function () {
                        let val = $mergeinput.val();
                        itemArray.forEach(function (e) {
                            $(e).parent().addClass('dn').removeClass('dk');
                            if ($(e).next().text().indexOf(val) !== -1) {
                                $(e).parent().addClass('dk').removeClass('dn');
                            }
                        })
                    })
                }
            }
        })
    },
    checkliandong: function (current, allitem, type) {
        if (type === 'free') {
            if (current.hasClass('icon-fuxuankuangxuanzhong')) {
                $(current).addClass('icon-fuxuankuang1');
                $(current).removeClass('icon-fuxuankuangxuanzhong');

                allitem.forEach(function (item) {
                    if ($(item).parent().attr('code') === $(current).parent().attr('code')) {
                        $(item).removeClass('icon-fuxuankuangxuanzhong');
                        $(item).addClass('icon-fuxuankuang1');
                    }
                })
            } else {
                $(current).addClass('icon-fuxuankuangxuanzhong');
                $(current).removeClass('icon-fuxuankuang1');
                allitem.forEach(function (item) {
                    if ($(item).parent().attr('code') === $(current).parent().attr('code')) {
                        $(item).addClass('icon-fuxuankuangxuanzhong');
                        $(item).removeClass('icon-fuxuankuang1');
                    }
                })
            }

        } else {
            current.forEach(function (c) {
                allitem.forEach(function (a) {
                    if ($(c).parent().attr('code') === $(a).parent().attr('code')) {
                        if ($(c).hasClass('icon-fuxuankuangxuanzhong')) {
                            $(a).addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                        } else {
                            $(a).removeClass('icon-fuxuankuangxuanzhong').addClass('icon-fuxuankuang1');
                        }
                    }
                })
            })
        }

    },
    hasclass: function (dom) {
        if ($(dom).hasClass('icon-fuxuankuang1')) {
            $(dom).addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
            $(dom).parent().siblings().find('i').removeClass('icon-fuxuankuangxuanzhong').addClass('icon-fuxuankuang1');
        } else {
            $(dom).addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
        }
    },
    isClass: function (ele, classname) {
        let hasClass;
        $(ele).hasClass(classname) ? hasClass = true : hasClass = false;
        return hasClass;
    },
};

window.datasupDownloadExcel = function (sceneCode, excelObj, queryJson, pageCode) {
    initOpt.scene = sceneCode;
    let $downloadExcel = MyApplication.element('div', 'maskLayer', 'downloadExcel', $editExcelHtml);
    document.body.appendChild($downloadExcel);

    let eVal = $('#excelVal');  //excel对象输入框
    let dropUl = $("#dropdown ul");  //下拉框
    let excelItem = $('#downloadExcel .excelItem');
    let excelCode = ""; //当前excel对象numberCode
    eVal.val("");

    !function () {

        getExcelList();
        getConditionList();
        //下拉框动画效果
        $(document).click(function () {
            $("#dropdown").slideUp(100);
            $('.change-format .func-list').slideUp(100);
        });

        let $iconnavup = $("#downloadExcel .select-box .icon-navup");
        $iconnavup.on('click', function () {
            $("#dropdown").slideToggle(150);
            event.stopPropagation();
        });

        //查询excel对象
        $("#excelVal").on('input', function () {
            $("#dropdown").slideDown(100);
            getExcelList();
        });

        //刷新
        let $refresh = $('#refreshExcelList');
        $refresh.on('click', function () {
            $(this).addClass('refresh-excel');
            getExcelList('');
            getConditionList();
        });

        //销毁下载excel弹出框
        $("#closeDownload,#downloadExcel .cancelDownload").on('click', function () {
            MaytekQ.destroy('downloadExcel-search');
            $("#downloadExcel").remove();
            $('.dz-hidden-input').remove();
        });

        //快捷编辑
        let $quickEdit = $('#downloadExcel .quick-edit');
        $quickEdit.on('click', function () {
            $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active');
            $('#downloadExcel .inner-wrap').css('pointer-events', 'none');
            let isCustom = initOpt.isCustom;
            if (isCustom === 1) {
                let $addExcel = MyApplication.element('div', 'paCenter pd20 sd15 br6', 'customExcel', $addExcelHtml);
                $downloadExcel.appendChild($addExcel);
                let checkbox = $('.excel-config').find('.checkbox').find('span');
                Array.from(checkbox).forEach(function (i) {
                    let icon = $(i).find('i');
                    icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                });

                $('.excel-config .change-format').hide();
                let excelcode = $('#excelCode').attr('value');
                editCustomExcel(excelcode);

                //关闭上传exce模板
                $('#downloadExcel #customExcel .closeEdit').off('click').on('click', function () {
                    $('#downloadExcel .inner-wrap').css('pointer-events', 'inherit');
                    $('#customExcel').remove();
                    $('.quick-edit').removeClass('active');
                });

                //上传excel模板
                $('#uploadtemp').off('click').on('click', function () {
                    MyApplication.uploadFileFN(function (res) {
                        let name = res.content.fileName;
                        modelUrl = res.content.url;
                        let modename = name.split('.' + res.content.suffix)[0];
                        $('body').find('#uploadExcel').remove();
                        columnList = [];
                        MyApplication.analysisExcelTemplate(name, modename, modelUrl)
                    })

                });

                //监听提交编辑配置
                $('#customExcel button[name="submit"]').on('click', function () {
                    MyApplication.submitConfigData('edit');
                    let excelcode = $('#excelCode').val();
                    excelObj.excel = excelcode;
                    getExcelList();
                    getConditionList();
                    let $previewMode = $('#downloadExcel .preview-mode');
                    if($previewMode.hasClass('active')){
                        $previewMode.click();
                    }
                    $('button.closeEdit').click();
                });

            } else {
                $("#editBox").show();
                let excelinput = $('.excel-name input');
                excelinput.val(initOpt.excelname);
                MyApplication.getColumList(0);
            }

        });

        //预览模式
        let $previewMode = $('#downloadExcel .preview-mode');
        let $previewTab = $('#downloadExcel .preview-tab');
        let $excelItem = $('#downloadExcel .excelItem');
        $previewMode.removeClass('active');
        $excelItem.addClass('dk').removeClass('dn');
        $previewTab.addClass('dn').removeClass('dk');
        $previewMode.on('click', function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $previewTab.addClass('dn').removeClass('dk');
                $excelItem.addClass('dk').removeClass('dn');

            } else {
                $(this).addClass('active');
                $excelItem.addClass('dn').removeClass('dk');
                $previewTab.addClass('dk').removeClass('dn');
                $previewTab.css({
                    "position": "relative",
                    "z-index": '0',
                    "width": "100%"
                });
                previewMode();
            }
        });

        //关闭编辑框
        let $closeEditBox = $('#editBox .cancel');
        $closeEditBox.on('click', function () {
            $("#editBox").hide();
            $('.mode-switch .quick-edit').removeClass('active');
            $('#downloadExcel .inner-wrap').css('pointer-events', 'inherit');
        });

        //编辑 、新增
        let $saveEdit = $("#editBox .save");
        let $addExcel = $('#editBox .newExcel');
        $saveEdit.on('click', function () {
            editCheckedItem('edit')
        });
        $addExcel.on('click', function () {
            editCheckedItem('add');
        });

        //确认下载
        let $download = $('#downloadExcel .download');
        $download.on('click', function () {
            downloadExcel();
        });

        //查询条件
        let $search = $('#searchItembtn');
        $search.on('click', function () {
            searchItem();
        });

        //回车键查询
        $("#searchItemInput").on('keydown', function (event) {
            if (event.keyCode === 13) {
                searchItem();
            }
        });
        //普通excel编辑模块刷新
        $('#refresh').on('click', function () {
            MyApplication.getColumList(0);
        });
    }();

    //获取EXCEL下拉框列表
    function getExcelList(val) {
        !eVal.val() ? excelCode = "" : '';
        $("#downloadExcel .reslutItem").empty();
        $("#downloadExcel .selectednum").empty();
        let itemHtml = "";
        let query = val !== undefined ? val : eVal.val();
        xyzAjax({
            url: "../Datasup_ExcelWS/getExcelList.do",
            async: false,
            data: {
                pageCode: pageCode,
                q: query,
                excelCode: excelObj.excel,
            },
            success: function (data) {
                if (data.status === 1) {
                    let listArr = data.content;
                    dropUl.empty();  //清空下拉框
                    itemHtml = $(`<span class='resultCol default'></span>`);
                    excelItem.html(itemHtml);
                    for (let i in listArr) {
                        let obj = listArr[i];
                        let pubPriv = obj.pubPriv;
                        let pbuText = '';
                        if (pubPriv === 0) {
                            pbuText = '【公有】'
                        }
                        if (pubPriv === 1) {
                            pbuText = '【机构】'
                        }
                        if (pubPriv === 2) {
                            pbuText = '【个人】'
                        }

                        if (excelObj.excel === obj.numberCode) {
                            initOpt.scene = obj.scene;
                            initOpt.scenename = obj.sceneName;
                            initOpt.excelname = obj.xlsName;
                            initOpt.isCustom = obj.isCustom;
                            excelObj.nameCn = pbuText + obj.xlsName;
                            excelObj.scene = obj.scene;
                            eVal.val(excelObj.nameCn); //默认当前excel对象
                            excelCode = excelObj.excel; //默认当前excel对象numberCode
                            $('#excelCode').val(excelObj.excel);

                        }

                        let $li = $(`<li id="${'xls_' + obj.numberCode}" class="pd10 iconfont" ><span class="icon-custom">定</span><p>${pbuText + obj.xlsName}</p></li>`);
                        let $icon = $(`<i class="iconfont icon-chacha"></i>`);
                        obj.isCustom === 1 ? $li.find('.icon-custom').show() : $li.find('.icon-custom').hide();
                        pubPriv === 2 ? $li.append($icon) : '';

                        $li.off('click').on('click', function () {
                            event.stopPropagation();
                            $('.mode-switch').show();
                            let $previewTab = $('#downloadExcel .preview-tab');
                            let $excelItem = $('#downloadExcel .excelItem');
                            $previewTab.addClass('dn').removeClass('dk');
                            $excelItem.addClass('dk').removeClass('dn');
                            $('.preview-mode').removeClass('active');

                            eVal.val($(this).find('p').text());
                            $('#excelCode').attr('value', obj.numberCode);
                            excelCode = obj.numberCode;
                            excelObj.excel = obj.numberCode;
                            excelObj.nameCn = $(this).text();
                            initOpt.scene = obj.scene;
                            initOpt.scenename = obj.sceneName;
                            initOpt.excelname = obj.xlsName;
                            initOpt.isCustom = obj.isCustom;

                            let itemHtml = $(`<span class='resultCol default'></span>`);
                            excelItem.html(itemHtml);
                            $("#dropdown").slideUp(100);
                            getConditionList()
                        });

                        $icon.off('click').on('click', function () {
                            event.stopPropagation();
                            let code = $(this).parent().attr('id').split('xls_')[1];
                            let parentLi = $icon.parent();
                            deletePubPriv(code, parentLi);
                        });
                        dropUl.append($li);
                    }


                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                }
            }
        });
    }

    //删除私有对象
    function deletePubPriv(code, parentLi) {
        xyzAjax({
            url: "../Datasup_ExcelWS/deletePrivateExcel.do",
            async: true,
            data: {
                excel: code
            },
            success: function (data) {
                if (data.status === 1) {
                    if (excelCode === code) {
                        $('#excelVal').val('');
                        $('#excelCode').attr('value', '');
                        resultItem = [];
                        excelItem.empty();
                        $("#downloadExcel .selectednum").empty();
                        $('.preview-tab').empty();
                        $('.mode-switch').hide();
                        getExcelList();
                    } else {
                        $(parentLi).remove();
                    }
                    top.$.messager.alert("警告", "删除成功！", "warning", 'success');
                } else {
                    top.$.messager.alert("警告", data.msg, "warning", 'error');
                }
            }
        })
    }

    //获取查询条件列表
    function getConditionList() {
        /* 查询加载动画 */
        let loading = "<div class='xyzgridMask'><div class='spinner'><span>加载中</span><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
        $(".xyzgridMask").remove();
        $("#downloadExcel").append(loading);
        let condJson = {};
        let condArr = []; //传入maytekQ的值
        let pJson = [];  //maytekQ返回的查询结果
        MaytekQ.destroy('downloadExcel-search');
        xyzAjax({
            url: "../Datasup_ExcelWS/getConditionList.do",
            async: true,
            data: {
                scene: initOpt.scene
            },
            success: function (data) {
                if (data.status === 1) {
                    let ditem = data.content;
                    for (let i in ditem) {
                        let defaultQuery = i < 7 ? 'true' : 'false'; //默认展示7个查询条件
                        condJson = {
                            'options': {},
                            'keyLabel': ditem[i].nameCn,
                            'defaultQuery': defaultQuery,
                            'key': ditem[i].nameKey,
                            'type': ditem[i].type,
                        };
                        if (!xyzIsNull(ditem[i].setUp)) {
                            let option = xyzHtmlDecode(ditem[i].setUp);
                            let optionJson = eval('(' + option + ')');
                            condJson['options'] = optionJson;
                        }
                        condArr.push(condJson);
                    }
                    MaytekQ.init({
                        id: 'downloadExcel-search',
                        scrollMaxHeight: 500,
                        group: {
                            "allQuery":
                                {
                                    text: '更多',
                                    data: condArr
                                }
                        },
                        onQuery: function (data) {
                            pJson = data;
                            getExcelColumnList(pJson);
                        },
                        onLoad: function () {
                            if (!xyzIsNull(queryJson)) {
                                let data = queryJson;//JSON.parse(queryJson);
                                if (typeof queryJson !== 'object') {
                                    data = JSON.parse(queryJson);
                                    delete data.flagDefaultFastForQuery;//删掉是否使用缓存的默认过滤器条件
                                    MaytekQ.setKeyData('downloadExcel-search', data);
                                } else {
                                    delete data.flagDefaultFastForQuery;//删掉是否使用缓存的默认过滤器条件
                                    MaytekQ.setKeyData('downloadExcel-search', data);
                                }
                            }

                        }

                    });
                    $(".xyzgridMask").remove();
                    $('#downloadExcel-search').resize();
                    $('#refreshExcelList').removeClass('refresh-excel');
                    getExcelDownloadInfo();
                }
            }
        })
    }

    //预览 预计耗时
    function getExcelColumnList(pJson) {
        let time = 0; //预计耗时
        let total = 0; //预计数据量
        $("#downloadExcel .reslutItem").css('display', "none");
        excelCode = $('#excelCode').val();
        if (!excelCode && !eVal.val()) {
            top.$.messager.alert("警告", "请选择excel对象", "warning");
            return;
        }
        /* 查询加载动画 */
        let loading = "<div class='xyzgridMask'><div class='spinner'><span>加载中</span><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
        $(".xyzgridMask").remove();
        $("#downloadExcel").append(loading);

        xyzAjaxLongtimeRequest({
            url: "../Datasup_ExcelWS/getExcelDownloadInfo.do",
            async: true,
            looptime: 2,
            data: {
                excel: excelCode,
                queryJson: pJson,
            },
            success: function (data) {
                if (data.status === 1) {
                    let resultHtml = "";
                    time = data.content.time === null ? 0 : data.content.time;
                    total = data.content.total === null ? 0 : data.content.total;
                    resultHtml = "预计耗时<span class='warning' style='font-weight: bold;font-size: 20px'>" + time + "s</span>，预计数据量<span class='warning' style='font-weight: bold;font-size: 20px'>" + total + "条";
                    $("#downloadExcel .reslutItem").html(resultHtml);
                    $("#downloadExcel .reslutItem").css('display', "block");
                    $(".xyzgridMask").remove();
                } else {
                    if (data.content) {
                        top.$.messager.alert("警告", data.content.LONG_TIME_REQUEST_MSG, "warning");
                    } else {
                        top.$.messager.alert("警告", data.msg, "warning");
                    }
                    $(".xyzgridMask").remove();

                }
            }
        })
    }

    //编辑 、新增
    function editCheckedItem(type) {
        let colArr = [];
        let colList = [];
        let columnJson = {};
        let $checkitem = $("#editBox .group-item i.icon-fuxuankuangxuanzhong").parent();
        let newNameval = $('.excel-name .formControl');


        if (type === 'edit') {
            if (!eVal.val()) {
                top.$.messager.alert("提示", "请选择excel对象！", "info");
                return
            } else if (!newNameval.val()) {
                top.$.messager.alert("提示", "请输入excel名称！", "info");
                return
            }
        } else if (type === 'add') {
            if (!newNameval.val()) {
                top.$.messager.alert("提示", "请输入excel名称！", "info");
                return
            }
        }

        colArr = Array.from($checkitem);
        colArr.forEach(function (c) {
            let code = $(c).attr('code');
            let name = $(c).text();
            let index = $(c).attr("colindex");

            columnJson = {
                numberCode: code,
                nameCn: name,
                alias: name,
                sort: index === undefined ? 0 : parseInt(index),
            };
            colList.push(columnJson);
        });
        let newColArr = MyApplication.unique(colList);

        excelCode = $('#excelCode').val();

        xyzAjax({
            url: "../Datasup_ExcelWS/addPrivateExcel.do",
            data: {
                scene: initOpt.scene,
                nameCn: newNameval.val(),
                columnJson: JSON.stringify(newColArr),
                excel: type === 'edit' ? excelCode : "",
                fromExcel: excelCode,
            },
            success: function (data) {
                if (data.status === 1) {
                    excelObj.excel = data.content;
                    excelCode = data.content;
                    if (type === 'add') {
                        $('#excelVal').val(newNameval.val());
                    }
                    getExcelList();
                    getExcelDownloadInfo();
                    $('#editBox .cancel').click();
                    top.$.messager.alert("警告", "编辑成功！", "warning", 'success');
                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                }
            }
        })
    }

    //确认下载
    function downloadExcel() {
        let url = '../Datasup_ExcelWS/downloadExcel.do';
        window.datasupProgressBar.begin();
        let pJson = MaytekQ.getData('downloadExcel-search');
        if (pJson === undefined) {
            pJson = "";
        }
        excelCode = $('#excelCode').val();

        xyzAjaxLongtimeRequest({
            url: url,
            async: true,
            looptime: 2,
            data: {
                excel: excelCode,
                queryJson: pJson,
            },
            success: function (data) {
                if (data.status === 1) {
                    if (mxApi.isPc()) {
                        window.location.assign(data.content.url);
                    } else {
                        window.open(data.content.url);
                    }
                    window.datasupProgressBar.finish();
                } else {
                    if (data.msg) {
                        top.$.messager.alert("警告", data.msg, "warning")
                    } else {
                        top.$.messager.alert("警告", "操作失败！", "warning")
                    }
                    window.datasupProgressBar.finish();
                }
            },
            error: function () {
                window.datasupProgressBar.finish();
            }
        })
    }

    //查询
    function searchItem() {
        let searchVal = $('#searchItemInput').val();
        if (!searchVal) {
            top.$.messager.alert("提示", "查询条件不能为空！", "info");
            return
        }

        xyzAjax({
            url: '../Datasup_ExcelWS/getColumLikeList.do',
            data: {
                scene: initOpt.scene,
                name: searchVal,
                excel: $('#excelCode').val(),
            },
            success: function (data) {
                if (data.status === 1) {
                    if (data.content.length === 0) {
                        top.$.messager.alert("提示", "没有查询到符合条件的结果！", "info");
                        return
                    }
                    let searchData = data.content;

                    let $searchGroup = $('#searchGroup');
                    let $groupinner = $('#editBox .group-inner');
                    let $allItem = $groupinner.find('i');
                    let allitem = Array.from($allItem);
                    $searchGroup.empty();
                    $('.select-group i').addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');

                    searchData.forEach(function (e) {
                        let $titleHtml = $(`<div class='group-item dk' type="${e.name}"><p class='item-title'>${e.name}</p></div>`);
                        let $ul = $(`<ul class='clearfloat'></ul>`);
                        $titleHtml.append($ul);

                        e.list.forEach(function (item) {
                            let $li = $(`<li code="${item.numberCode}"><i class='iconfont icon-fuxuankuang1 csPointer'></i>${item.alias === "" ? item.columnName : item.alias}</li>`);
                            $ul.append($li);
                            let $icon = $li.find('i');

                            allitem.forEach(function (a) {
                                if (item.numberCode === $(a).parent().attr('code')) {
                                    if ($(a).hasClass('icon-fuxuankuangxuanzhong')) {
                                        if ($(a).hasClass('icon-fuxuankuangxuanzhong')) {
                                            $icon.addClass('icon-fuxuankuangxuanzhong').removeClass('icon-fuxuankuang1');
                                        } else {
                                            $icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
                                        }
                                    }
                                }
                            });
                        });
                        $searchGroup.append($titleHtml);
                        $groupinner.addClass('dn').removeClass('dk');
                        $searchGroup.addClass('dk').removeClass('dn');
                    });

                } else {
                    top.$.messager.alert("警告", data.msg, "warning")
                }
            }
        })
    }

    //预览模式
    function previewMode() {
        let excelcode = $('#excelCode').val();
        let $perview = $("#downloadExcel .preview-tab"); //预览模式
        $perview.empty();
        pJson = MaytekQ.getData('downloadExcel-search');
        if (pJson === undefined) {
            pJson = "";
        }
        xyzAjax({
            url: '../Datasup_CustomExcelWS/previewCustomExcel.do',
            data: {
                excelCode: excelcode,
                queryJson: pJson,
            },
            success: function (data) {
                if (data.status === 1) {
                    let excelColumnList = data.content.excelColumnList;  //表格信息
                    let modelDataList = data.content.excelModelDataList !== '' ? data.content.excelModelDataList : [];
                    let dataList = data.content.dataList;
                    initOpt.isCustom = data.content.excel.isCustom;
                    initOpt.titlerow = data.content.excel.titleRow;
                    initOpt.limitcol = data.content.excel.limitCol;
                    let startrow = data.content.excel.limitRow;

                    if (initOpt.isCustom === 0) {
                        let $table = $(`<table class="table" cellpadding="0" cellspacing="0"><thead><tr></tr></thead><tbody></tbody></table>`);
                        $perview.html($table);
                        let $theadtr = $table.find('thead').find('tr');
                        let $tbody = $table.find('tbody');
                        excelColumnList.forEach(function (e) {
                            let $th = $(`<th>${e.alias}</th>`);
                            $th.css({
                                "font-weight": 'normal',
                                "background-color": "#e2ebf4",
                                "color": "#3b72a8",
                                "padding": "15px 10px",
                            });
                            $theadtr.append($th);
                        });
                        let dataJson = dataList || [];
                        dataJson.forEach(function (t) {
                            let $tr = $(`<tr></tr>`);
                            $tbody.append($tr);
                            t.forEach(function (d) {
                                let $td = $(`<td>${d}</td>`);
                                $td.css({
                                    "padding": "15px 10px",
                                });
                                $tr.append($td);
                            });
                        })

                    } else if (initOpt.isCustom === 1) {
                        let $table = $(`<table class="table" cellpadding="0" cellspacing="0"></table>`);
                        let $tbody = $(`<tbody></tbody>`);
                        $perview.html($table);
                        $table.html($tbody);

                        //绘制用户模板行
                        modelDataList.forEach(function (item, n) {
                            if (n < startrow) {
                                let $tr = $(`<tr></tr>`);
                                $table.append($tr);
                                item.forEach(function (t, idx) {
                                    if (t.merge !== '') {
                                        let colend = t.merge.col_end;   //结束列
                                        let colstart = t.merge.col_start;  //开始列
                                        let rowend = t.merge.row_end;   //结束行
                                        let rowstart = t.merge.row_start;    //开始行
                                        let $td = $(`<td>${t.value}</td>`);
                                        if (idx === colstart) {  //合并列
                                            $td.attr('colspan', colend - t.merge.col_start + 1);
                                            $tr.append($td);
                                            $td.nextAll().remove();
                                        }
                                        let rowcout = rowend - rowstart + 1 <= 0 ? 1 : rowend - rowstart + 1;
                                        $td.attr('rowspan', rowcout);
                                        $td.css('line-height', 40 * rowcout + 'px');
                                        $td.parent().addClass('merge-row');
                                    } else {
                                        let $td = $(`<td>${t.value}</td>`);
                                        $tr.append($td);
                                    }
                                });

                            }
                        });

                        let mergerow = Array.from($tbody.find('.merge-row'));
                        mergerow.forEach(function (m) {
                            let nexttr = Array.from($(m).next().find('td'));
                            nexttr.forEach(function (n) {
                                if (n.hasAttribute('rowspan')) {
                                    let row = parseInt($(n).attr('rowspan'));
                                    if (row > 1) {
                                        if (row > 1 && $(n).text() === '') {
                                            $(n).remove();
                                        }
                                    }

                                }
                            });
                        });

                        // //绘制用户数据展示行
                        dataList.forEach(function (d) {
                            let $tr = $(`<tr class="data-row"></tr>`);
                            for (let i = 0; i < data.content.maxCellIndex; i++) {
                                let $td1 = $(`<td></td>`);
                                $tr.append($td1);
                                if (i >= initOpt.limitcol) {
                                    let j = i - initOpt.limitcol;
                                    if (j <= excelColumnList.length - 1) {
                                        $td1.text(d[j]);
                                    }
                                }
                            }
                            $table.append($tr);
                        })

                    }
                } else {
                    top.$.messager.alert("警告", data.msg, "warning")
                }
            }
        });
    }

    //普通模式
    function getExcelDownloadInfo() {
        let datanumhtml = "";
        let datanum = 0;
        let $selectednum = $("#downloadExcel .selectednum");
        let $resultCol = $("#downloadExcel .resultCol");

        $selectednum.empty();
        $resultCol.empty();

        pJson = MaytekQ.getData('downloadExcel-search');

        xyzAjax({
            url: "../Datasup_ExcelWS/getExcelColumnList.do",
            async: true,
            data: {
                excel: $('#excelCode').val(),
                queryJson: pJson,

            },
            success: function (data) {
                if (data.status === 1) {
                    resultItem = data.content;
                    datanum = resultItem.length;
                    for (let i in resultItem) {
                        let $i = $(`<i>${resultItem[i].alias ? resultItem[i].alias : resultItem[i].columNameCn}</i>`);
                        if (resultItem[i].alias === '' && resultItem[i].columNameCn === '') {
                            $i.text('空')
                        }
                        $resultCol.append($i);
                    }
                    datanumhtml = "已选择<i class='datanum primary' style='font-style: normal'>(" + datanum + "列)</i>";
                    $selectednum.html(datanumhtml);
                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                }
            }
        })
    }

    //编辑定制excel
    function editCustomExcel(excelcode) {
        xyzAjax({
            url: '../Datasup_CustomExcelWS/getCustomExcelInfo.do',
            data: {
                excelCode: excelcode,
            },
            success: function (data) {
                if (data.status === 1) {
                    let content = {};
                    content.dataList = data.content.excelModelDataList === '' ? [] : data.content.excelModelDataList;
                    content.maxCellIndex = data.content.maxCellIndex;
                    columnList = data.content.excelColumnList;
                    let excelcn = data.content.excel.xlsName;
                    let startrow = data.content.excel.limitRow + 1;
                    initOpt.titlerow = data.content.excel.titleRow === 0 ? 1 : data.content.excel.titleRow;
                    initOpt.limitcol = data.content.excel.limitCol + 1;
                    initOpt.scene = data.content.excel.scene;
                    initOpt.scenename = data.content.excel.sceneName;
                    modelUrl = data.content.excel.customModelUrl;
                    let modename = data.content.excel.customModelFilName;
                    let excelcode = data.content.excel.numberCode;
                    $('#selectScene').attr('code', initOpt.scene);   //场景编号
                    $('#selectScene').val(initOpt.scenename);    //场景名称
                    $('.basic-config-wrap .excelname').val(excelcn);    //excel名称
                    $('.basic-config-wrap .excelname').attr('code', excelcode);    //excel名称
                    $('.basic-config-wrap .titlerow').val(initOpt.titlerow);  //标题行
                    $('.basic-config-wrap .limitcol').val(initOpt.limitcol); //开始列
                    $('.basic-config-wrap .startrow').val(startrow); //开始行
                    $('.uploadTemp input').val(modename); //模板名臣

                    MyApplication.getSceneList();
                    MyApplication.getColumList(1);
                    MyApplication.modepreView(content);

                } else {
                    top.$.messager.alert("警告", data.msg, "warning")
                }
            }
        })
    }
};

window.addCustomExcel = function () {
    let $downloadExcel2 = MyApplication.element('div', 'maskLayer', 'downloadExcel2', '');
    document.body.appendChild($downloadExcel2);
    let $customexcel = MyApplication.element('div', 'paCenter pd20 br6', 'customExcel', $addExcelHtml);
    $downloadExcel2.appendChild($customexcel);

    $('.excel-config .change-format').hide();
    $('#customExcel').find('input').val('');
    $('.excel-view').find('tbody').empty();
    $('.preview-excel').empty();
    $('.basic-config-wrap .limitcol').val("1");
    $('.basic-config-wrap .titlerow').val("1");
    $('.basic-config-wrap .startrow').val("1");
    let checkbox = $('.excel-config').find('.checkbox').find('span');
    Array.from(checkbox).forEach(function (i) {
        let icon = $(i).find('i');
        icon.addClass('icon-fuxuankuang1').removeClass('icon-fuxuankuangxuanzhong');
    });
    $('#selectScene').val('');
    $('#selectScene').attr('code', '');

    //上传excel模板
    $('#customExcel #uploadtemp').off('click').on('click', function () {
        MyApplication.uploadFileFN(function (res) {
            let name = res.content.fileName;
            modelUrl = res.content.url;
            let modename = name.split('.' + res.content.suffix)[0];
            $('body').find('#uploadExcel').remove();
            MyApplication.analysisExcelTemplate(name, modename, modelUrl)
        })

    });

    //关闭新增Excel面板
    $('#customExcel .closeEdit').off('click').on('click', function () {
        $("#downloadExcel2").remove();
    });

    $('#customExcel button[name="submit"]').on('click', function () {
        MyApplication.submitConfigData('add');
    });

};

//进度条构造函数
class datasupProgressBar {
    constructor() {
        this.progress = '';
    }

    begin() {
        let $this = this;
        let $parent = $('#downloadExcel .inner-wrap');
        $this.progress && $this.progress.remove();
        $this.progress = document.createElement('div'); //progressBarStriped
        $this.progress.className = 'progress-box';
        $parent.append($this.progress);

        let $child = document.createElement('div');
        $child.className = "progressWid";
        $this.progress.appendChild($child);
        $parent.css('pointer-events', 'none');
    }

    finish() {
        let $this = this;
        if (!$this.progress) {
            return
        }
        let $parent = $('#downloadExcel .inner-wrap');
        $parent.css('pointer-events', 'inherit');
        let $child = $(".progress-box .progressWid");
        $child.style = "width:100%;animation:none;opacity:0;";

        let removeTimer = setTimeout(function () {
            try {
                $this.progress.remove();
            } catch (e) {
            }
            $this.progress = '';
            clearTimeout(removeTimer);
            removeTimer = null;
        }, 500)
    }
}

window.datasupProgressBar = new datasupProgressBar();
