function html2pdf(id, name) {
    var element = document.querySelector(id);    // 这个dom元素是要导出pdf的div容器
    var $tab = element.querySelector('table');
    var w = element.offsetHeight;    // 获得该容器的宽
    var h = element.offsetWidth;    // 获得该容器的高
    var offsetTop = element.clientHeight;    // 获得该容器到文档顶部的距离
    var offsetLeft = element.clientLeft;    // 获得该容器到文档最左的距离
    var canvas = document.createElement("canvas");
    var abs = 0;
    var win_i = document.querySelector("body").offsetWidth;    // 获得当前可视窗口的宽度（不包含滚动条）
    var win_o = window.innerWidth;    // 获得当前窗口的宽度（包含滚动条）
    if (win_o > win_i) {
        abs = (win_o - win_i) / 2;    // 获得滚动条长度的一半
    }
    canvas.width = w * 1;    // 将画布宽&&高放大1倍
    canvas.height = h * 1;
    var context = canvas.getContext("2d");
    //关闭抗锯齿
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    context.msImageSmoothingEnabled = false;
    context.imageSmoothingEnabled = false;
    context.scale(1, 1);
    context.translate(-offsetLeft - abs, -offsetTop);
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
    // translate的时候，要把这个差值去掉
    html2canvas(element, {
        useCORS: true,
        logging: true,
    }).then(function (canvas) {
        var contentWidth = canvas.width;
        var contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        var pageHeight = contentWidth / 595.28 * 841.89;
        //未生成pdf的html页面高度
        var leftHeight = contentHeight;
        //页面偏移
        var position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        var imgWidth = 595.28;
        var imgHeight = 595.28 / contentWidth * contentHeight;

        var pageData = canvas.toDataURL('image/jpeg', 1.0);
        var pdf = new jsPDF('p', 'pt', 'a4');
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {    // 分页
            while (leftHeight > 0) {
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 841.89;
                //避免添加空白页
                if (leftHeight > 0) {
                    pdf.addPage();
                }
            }
        }
        pdf.save(name);

    })
}

window.html2pdf = html2pdf;