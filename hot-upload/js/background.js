/**
 * Az代码
 * 插件热更新模块逻辑
 * 热更新模块：
 * backgroundv
 * commonv
 * mainv
 * optionsv
 * popupv
 * utilsv
 * 
 */
var _t = new Date();
    _t = _t.getTime();
// 获取文件版本号接口
var verstion_url = azAPI+"/crx_hot_upload/version.json?_t=" + _t;
// 文件版本号
var az_version = '';
initVersion();
// 获取本地版本
function initVersion(){
    chrome.storage.local.get('az_version',function(e){
        az_version = $.isEmptyObject(e) ? '' : e.az_version;
        // 判断是否有版本记录
        if(!az_version){
            // 无版本记录
            az_version = {
                backgroundv: '1.0.0.1',
                commonv: '1.0.0.1',
                mainv: '1.0.0.1',
                optionsv: '1.0.0.1',
                popupv: '1.0.0.1',
                utilsv: '1.0.0.1',
            }
            // 首次加载插件  加载本地文件
            for(let key in az_version){
                let lurl = 'local/'+key+'.js';
                r(lurl,function(data){
                    chrome.storage.local.set({[key]: data},function(){
                        // background后台代码执行
                        if(key=='backgroundv'){
                            start();
                        }
                    })
                })
            }
            // 首次加载插件  存储初始文件版本
            chrome.storage.local.set({az_version: az_version},function(){
                getConfig(verstion_url,function(in_version){
                    in_version = JSON.parse(in_version);
                    compare(az_version,in_version)
                });
            })
        }else{
            getConfig(verstion_url,function(in_version){
                in_version = JSON.parse(in_version);
                compare(az_version,in_version)
            });
        }
    });
}

// 发送请求
function r(e, t) {
    var r = new XMLHttpRequest;
    r.addEventListener("load", function() {
        t(r.responseText)
    }), r.open("GET", e, !0), r.send()
}

// 获取配置
function getConfig(_config_server,f) {
    r(_config_server, function(t) {
        try {
            f(t);
        } catch(r) {}
    })
}


// 比对线上文件版本
function compare(un_vs,in_vs){
    let upbg = false;
    for(let key in un_vs){
        let un_ = un_vs[key];
            un_ = un_.replace(/\./g,'');
        let in_ = in_vs[key];
            in_ = in_.replace(/\./g,'');
        if(un_*1<in_*1){
            // 当前版本不是最新版本
            if(key == 'backgroundv'){
                upbg = true;
            }
            let url = azAPI+"/crx_hot_upload/version/"+key+".js";
            // 清除本地存储的当前版本
            chrome.storage.local.remove(key, function () {
                r(url,function(data){
                    uploadStorage(key,in_vs[key],data);
                })
            });
        }else{
            // 判断本地存储是否有值   无值则请求最新对应版本存储
            chrome.storage.local.get(key, function (data) {
                if($.isEmptyObject(data)){
                    let url = azAPI+"/crx_hot_upload/version/"+key+".js";
                    r(url,function(data){
                        uploadStorage(key,in_vs[key],data);
                    })
                }
            });
        }
    }
    if(!upbg){
        start();
    }
}

// 执行background代码  不论background代码是否有更新都需要执行一次
function start() {
    chrome.storage.local.get("backgroundv", function (data) {
        new Function(data.backgroundv)();
    });
}

// 更新storage
function uploadStorage(key,vs,data){
    // 更新文件内容
    chrome.storage.local.set({[key]: data},function(){
        // 更新版本号
        az_version[key] = vs;
        chrome.storage.local.set({az_version: az_version},function(){
            // background后台代码执行
            if(key=='backgroundv'){
                start();
            }
        })
    })
}