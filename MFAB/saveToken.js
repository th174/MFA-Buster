try {
    const fullURL = location.href;
    const tokenMatcher = /www.pushbullet.com\/login-success#access_token=(.+)$/;
    const tokens = tokenMatcher.exec(fullURL);
    if (tokens.length > 0) {
        chrome.storage.sync.set({"pushbulletToken": tokens[1]});
        // chrome.storage.sync.get(['pushbulletToken'], function (result) {
        //     window.alert("Saved Token" + result.pushbulletToken)
        // });
    }
} catch (e) {
    window.alert(e.toString());
}
