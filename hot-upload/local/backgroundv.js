
// 搜狗浏览器处理
function browserObj() {
    var explorer = chrome;
    if (/MetaSr/i.test(navigator.userAgent)) {
        explorer = sogouExplorer;
    }
    return explorer;
}
//绑定监听事件,background.js接受从popup.js插件弹出框或者main.js淘宝商品详情页发过来的数据,做出相应的处理返回数据,request为接受的信息,sendResponse为返回信息方法
browserObj().extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch(request.name)
    {
        // 常规的ajax请求
        case "universal":
        $.ajax({
            type: request.type,
            url: request.url,
            dataType: request.dataType,
            data: request.data,
            success: function (e) {
                sendResponse({result: e,state: 1});
            }, error: function (r) {
                sendResponse({result: r,state: 0});
            }
        });
        break;
        // 更新文件版本
        case "updataVersion":
            initVersion();
        break;
        default: 
        break;
    }
    return true;
});