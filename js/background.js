//-------------------- 右键菜单演示 ------------------------//
// chrome.contextMenus.create({
//     title: "测试右键菜单",
//     onclick: function() {
//         chrome.notifications.create(null, {
//             type: 'basic',
//             iconUrl: 'img/icon.png',
//             title: '这是标题',
//             message: '您刚才点击了自定义右键菜单！'
//         });
//     }
// });
// chrome.contextMenus.create({
//     title: '使用度娘搜索：%s', // %s表示选中的文字
//     contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
//     onclick: function(params) {
//         // 注意不能使用location.href，因为location是属于background的window对象
//         chrome.tabs.create({ url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText) });
//     }
// });



//-------------------- badge演示 ------------------------//
/*(function()
{
	var showBadge = false;
	var menuId = chrome.contextMenus.create({
		title: '显示图标上的Badge',
		type: 'checkbox',
		checked: false,
		onclick: function() {
			if(!showBadge)
			{
				chrome.browserAction.setBadgeText({text: 'New'});
				chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
				chrome.contextMenus.update(menuId, {title: '隐藏图标上的Badge', checked: true});
			}
			else
			{
				chrome.browserAction.setBadgeText({text: ''});
				chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
				chrome.contextMenus.update(menuId, {title: '显示图标上的Badge', checked: false});
			}
			showBadge = !showBadge;
		}
	});
})();*/

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});

$('#test_cors').click((e) => {
    $.get('https://www.baidu.com', function(html) {
        console.log(html);
        alert('跨域调用成功！');
    });
});

$('#get_popup_title').click(e => {
    var views = chrome.extension.getViews({ type: 'popup' });
    if (views.length > 0) {
        alert(views[0].document.title);
    } else {
        alert('popup未打开！');
    }
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, { url: url });
    })
}

// 新标签打开某个链接
function openUrlNewTab(url) {
    chrome.tabs.create({ url: url });
}

// // omnibox 演示
// chrome.omnibox.onInputChanged.addListener((text, suggest) => {
//     console.log('inputChanged: ' + text);
//     if (!text) return;
//     if (text == '美女') {
//         suggest([
//             { content: '中国' + text, description: '你要找“中国美女”吗？' },
//             { content: '日本' + text, description: '你要找“日本美女”吗？' },
//             { content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？' },
//             { content: '韩国' + text, description: '你要找“韩国美女”吗？' }
//         ]);
//     } else if (text == '微博') {
//         suggest([
//             { content: '新浪' + text, description: '新浪' + text },
//             { content: '腾讯' + text, description: '腾讯' + text },
//             { content: '搜狐' + text, description: '搜索' + text },
//         ]);
//     } else {
//         suggest([
//             { content: '百度搜索 ' + text, description: '百度搜索 ' + text },
//             { content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text },
//         ]);
//     }
// });

// // 当用户接收关键字建议时触发
// chrome.omnibox.onInputEntered.addListener((text) => {
//     console.log('inputEntered: ' + text);
//     if (!text) return;
//     var href = '';
//     if (text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
//     else if (text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
//     else if (text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
//     else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
//     openUrlCurrentTab(href);
// });

// 预留一个方法给popup调用
function testBackground() {
    alert('你好，我是background！');
}

// 是否显示图片
var showImage;
chrome.storage.sync.get({ showImage: true }, function(items) {
    showImage = items.showImage;
});
// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
// chrome.webRequest.onBeforeRequest.addListener(details => {
//     // cancel 表示取消本次请求
//     if (!showImage && details.type == 'image') return { cancel: true };
//     // 简单的音视频检测
//     // 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
//     if (details.type == 'media') {
//         chrome.notifications.create(null, {
//             type: 'basic',
//             iconUrl: 'img/icon.png',
//             title: '检测到音视频',
//             message: '音视频地址：' + details.url,
//         });
//     }
// }, { urls: ["<all_urls>"] }, ["blocking"]);

//打开count个标签后会自动关闭
//测试方法
function testCount(count) {
    // for (var i = 0; i < count; i++) {
    //     openUrlNewTab('http://baidu.com')
    //     getCurrentTabId(tabId => {
    //         // alert(tabId)
    //         // alert('http://baidu.com')
    //         Ltools.tabIDURL.push({ 'tabid': tabId, 'url': "http://baidu.com" })
    //     })
    // }

    Ltools.tabMax = count
    console.log(Ltools.tabIDURL.length, Ltools.tabIDURL)
        // alert(Ltools.tabIDURL.length)
    Ltools.interval = setInterval("openTargetURL()", Ltools.intervalTime)
}


//打开指定的url
//需要先判断Ltools.tabIDURL中是否有参数
//如果有的话，需要update url
function openTargetURL() {
    Ltools.intervalCount += 1;
    //表示没有打开页面或者打开的tab被关闭了,重新打开tab
    if (Ltools.tabMax > Ltools.tabIDURL.length) {
        //获取数据
        Ltools.todoOpen = Ltools.getTodoOpenUrl(Ltools.tabMax - Ltools.tabIDURL.length)
        var urls = Ltools.todoOpen

        for (Ltools.openURLCurrent = 0; Ltools.openURLCurrent < (Ltools.tabMax - Ltools.tabIDURL.length); Ltools.openURLCurrent++) {
            openUrlNewTab(urls[Ltools.openURLCurrent]['url'])
            getCurrentTabId(tabId => {
                // alert(tabId)
                // alert('http://baidu.com')
                //id为ajax response中与url一起组成信息
                //此处处于闭包中,Ltools.openURLCurrent一直都是最大值
                console.log('call', urls, Ltools.openURLCurrent)
                    //Ltools.tabIDURL.push({ 'tabid': tabId, 'url': urls[Ltools.openURLCurrent]['url'], id: urls[Ltools.openURLCurrent]['id'] })

                var tmp = Ltools.todoOpen.shift()
                if (undefined == tmp) {
                    return
                }
                Ltools.tabIDURL.push({ tabID: tabId, url: tmp['url'], id: tmp['id'] })
            })
        }
        return
    }

    //update tab的url
    var urls = Ltools.getTodoOpenUrl(Ltools.tabMax)
    for (var i = 0; i < Ltools.tabMax; i++) {
        chrome.tabs.update(Ltools.tabIDURL[i]['tabID'], { url: urls[i]['url'] });
        // 更新Ltools.tabIDURL
        // Ltools.tabIDURL.push({ 'tabid': tabId, 'url': urls[i]['url'], id: urls[i]['id'] })

        Ltools.tabIDURL[i]['url'] = urls[i]['url']
        Ltools.tabIDURL[i]['id'] = urls[i]['id']
    }
}

function showvar() {
    chrome.windows.getCurrent(function(currentWindow) {
        Ltools.windowsInfo = currentWindow
    });
    alert(Ltools.windowsID)
}

//停止inter
function stopInterval() {
    clearInterval(Ltools.interval)
}

//设置参数
//tabMax 最多打开的标签
//percent 挖矿CPU的百分比,0.3
function setParam(tabMax, percent) {

}
Array.prototype.remove = function(dx) {　　
        if (isNaN(dx) || dx > this.length) { return false; }　　
        for (var i = 0, n = 0; i < this.length; i++)　　 {　　　　 if (this[i] != this[dx])　　　　 {　　　　　　 this[n++] = this[i]　　　　 }　　 }　　
        this.length -= 1　
    }
    //删除tab调用
function removeTab() {
    console.log('()')
        //设置windows属性
    chrome.windows.getCurrent(function(currentWindow) {
            Ltools.windowsInfo = currentWindow
        })
        //https://chajian.baidu.com/developer/extensions/tabs.html#event-onRemoved
        //当移除tab时回调
        //e=>{tabId: 3015, windowId: 2290}
    chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
        console.log('onremoved')
        if (removeInfo.windowId !== Ltools.windowsInfo.id) {
            return
        }
        //在 Ltools.tabIDURL中遍历
        for (var i = 0, count = Ltools.tabIDURL.length; i < count; i++) {
            if (tabID == Ltools.tabIDURL[i]['tabID']) {
                //Ltools.tabIDURL = Ltools.tabIDURL.slice(i, 1)
                Ltools.tabIDURL.remove(i)
            }
        }
    })
}
//删除tab调用
setTimeout('removeTab()', 1500)