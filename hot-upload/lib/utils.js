chrome.storage.local.get("utilsv", function (data) {
    new Function(data.utilsv)();
});