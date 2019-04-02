var azAPI = "http://192.168.11.19:8000";
chrome.storage.local.get("commonv", function (data) {
    if(!$.isEmptyObject(data)){
        new Function(data.commonv)();
    }
});