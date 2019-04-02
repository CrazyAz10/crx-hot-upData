chrome.storage.local.get("mainv", function (data) {
    if(!$.isEmptyObject(data)){
        new Function(data.mainv)();
    }
});