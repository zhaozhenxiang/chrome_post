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
        var urls = Ltools.getTodoOpenUrl(Ltools.tabMax - Ltools.tabIDURL.length)
        if (0 == urls.length) {
            console.log('没有获取到能够打开的url')
            return
        }

        console.log('urls', urls)
        for (var i = 0; i < (Ltools.tabMax - Ltools.tabIDURL.length); i++) {
            Ltools.lookCount += 1
            openUrlNewTab(urls[i]['url'])
            getCurrentTabId(tabId => {
                // alert(tabId)
                // alert('http://baidu.com')
                //id为ajax response中与url一起组成信息
                //此处处于闭包中,i一直都是最大值
                console.log('call', urls, i);
                //Ltools.tabIDURL.push({ 'tabid': tabId, 'url': urls[i]['url'], id: urls[i]['id'] })
                // var tmp = Ltools.todoOpen.shift()
                var tmp = urls.shift()
                console.log(tmp)
                if (undefined == tmp) {
                    return
                }
                Ltools.tabIDURL.push({ tabID: tabId, url: tmp['url'], id: tmp['id'] })
                Ltools.opened.push({ tabID: tabId, url: tmp['url'], id: tmp['id'] })
            })
        }
        return
    }

    //update tab的url
    var urls = Ltools.getTodoOpenUrl(Ltools.tabMax)
    if (0 == urls.length) {
        console.log('没有获取到能够打开的url')
        return
    }
    console.log('urls', urls)

    for (var i = 0; i < Ltools.tabMax; i++) {
        chrome.tabs.update(Ltools.tabIDURL[i]['tabID'], { url: urls[i]['url'] });
        // 更新Ltools.tabIDURL
        // Ltools.tabIDURL.push({ 'tabid': tabId, 'url': urls[i]['url'], id: urls[i]['id'] })
        Ltools.lookCount += 1
        Ltools.tabIDURL[i]['url'] = urls[i]['url']
        Ltools.tabIDURL[i]['id'] = urls[i]['id']
        Ltools.opened.push({ tabID: Ltools.tabIDURL[i]['tabID'], url: urls[i]['url'], id: urls[i]['id'] })
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

    Ltools.interval = null
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
    // function removeTab() {
    //     console.log('()')
    //         //设置windows属性
    //     chrome.windows.getCurrent(function(currentWindow) {
    //             Ltools.windowsInfo = currentWindow
    //         })
    //         //https://chajian.baidu.com/developer/extensions/tabs.html#event-onRemoved
    //         //当移除tab时回调
    //         //e=>{tabId: 3015, windowId: 2290}
    //     chrome.tabs.onRemoved.addListener(function(tabID, removeInfo) {
    //         console.log('onremoved')
    //         if (removeInfo.windowId !== Ltools.windowsInfo.id) {
    //             return
    //         }
    //         //在 Ltools.tabIDURL中遍历
    //         for (var i = 0, count = Ltools.tabIDURL.length; i < count; i++) {
    //             if (tabID == Ltools.tabIDURL[i]['tabID']) {
    //                 //Ltools.tabIDURL = Ltools.tabIDURL.slice(i, 1)
    //                 Ltools.tabIDURL.remove(i)
    //             }
    //         }
    //     })
    // }
    //删除tab调用
    // setTimeout('removeTab()', 1500)

//调用注册接口
function regster(mail, pass) {
    var json = request.regster(mail, pass);
    //错误需要错误信息
    if (json.result != msg.rightResult) {
        return msg.setParam(false, msg.msg(json));
    }

    return msg.setParam(true)
}

//获取时间戳
function timestamp() {
    var json = request.timestamp()
        //错误需要错误信息
    if (json.result != msg.rightResult) {
        return 0;
    }

    return parseInt(json.info.int);
}
//登录接口的使用
function login(mail, pass) {
    var json = request.login(mail, pass);
    //错误需要错误信息
    if (json.result != msg.rightResult) {
        return msg.setParam(false, msg.msg(json));
    }
    //写入token
    Ltools.save(Ltools.saveKey.token, { token: json.info.token, userID: json.info.user_id });
    return msg.setParam(true)
}
//修改URL
function updateURL(urlTEXT, callback) {
    Ltools.get(Ltools.saveKey.token, function(data) {
        if (undefined == data) {
            return
        }

        callback(request.updateURL(urlTEXT, data));
    })
}


//获取url
function getURL(callback) {
    Ltools.get(Ltools.saveKey.token, function(data) {
        if (undefined == data) {
            return
        }
        callback(request.getURL(data));
    })
}


//alarm的调用函数
function onAlarm(alarmObj) {

}
//开始浏览
function startLook() {
    //写入Ltools.todoOpen
    appendTodoOpen();
    //每1分钟浏览
    chrome.alarms.create(Ltools.alarmLook, { periodInMinutes: Ltools.alaraLookMinutes });
    //每5分钟提交
    chrome.alarms.create(Ltools.alarmPost, { periodInMinutes: Ltools.alaraPostMinutes });
    //每10分钟提交获取url的请求
    chrome.alarms.create(Ltools.appendURL, { periodInMinutes: Ltools.appendURLMinutes });
}

//写入Ltools.todoOpen变量
function appendTodoOpen() {
    //个数不为空时不写入
    // if (0 != Ltools.todoOpen.length) {
    //     return
    // }

    Ltools.get(Ltools.saveKey.token, function(data) {
        if (undefined == data) {
            return
        }
        Ltools.todoOpenAppendCount += 1
        var r = request.getLookURL(data, Ltools.todoOpenLength)
        if (r.result != msg.rightResult) {
            return
        }
        //如果Ltools.todoOpen已经获取了一个url，但是用户修改了该url为禁用，那么该url会一直消耗用户的积分。除非用户重新启动chrome，即初始化Ltools
        // Ltools.todoOpen = Ltools.todoOpen.concat(r.info)
        Ltools.todoOpen = Ltools.todoOpen.concat(r.info)
    })
}

//停止浏览
function stopLook() {
    chrome.alarms.clearAll();
    // 需要发送还没有提交的url
    openedURLPost()
}
//alarms每分钟调用
chrome.alarms.onAlarm.addListener(function(alarmObj) {
    console.log(alarmObj)
        // if (Ltools.alarmLook == alarmObj.name) {
        //     //更新tab

    //     // Ltools.tabMax = count
    //     console.log(Ltools.tabIDURL.length, Ltools.tabIDURL)
    //         // alert(Ltools.tabIDURL.length)
    //     openTargetURL()
    //     return
    // }

    switch (alarmObj.name) {
        case Ltools.alarmLook:
            //更新tab
            //Ltools.tabMax = count
            console.log('定时浏览页面')
            console.log(Ltools.tabIDURL.length, Ltools.tabIDURL);
            // alert(Ltools.tabIDURL.length)
            openTargetURL()
            break;
        case Ltools.alarmPost:
            console.log('定时提交alarm的post');
            openedURLPost();
            break;
        case Ltools.appendURL:
            console.log('定时写入todoOpen');
            //设置一定的几率去获取数据
            if (Math.random(0, 1) < parseFloat(Ltools.config.requestPercent)) {
                appendTodoOpen()
            }
        default:
            break;
    }
});


//定时提交
//需要使用Ltools.opened变量
function openedURLPost() {
    //需要提交这些list
    Ltools.get(Ltools.saveKey.token, function(data) {
        //没有的返回值
        if (undefined == data) {
            stopLook()
            return;
        }
        //需要注意拿到数据时的该变量正在被写入
        //一般情况下count应该为Ltools.tabMax * Ltools.alaraPostMinutes
        var count = Ltools.opened.length;
        if (0 == count) {
            console.log('Ltools.opened的count为0')
            return;
        }
        var list = Ltools.opened.splice(0, count);
        var r = request.lookPost(data, list);
        //错误的返回值停止定时浏览
        if (msg.rightResult != r.result) {
            return
        }
    })
}
//打印全部alaram
function printAllAlarms() {
    chrome.alarms.getAll(function(a) { console.log(a) })
}
//处理alaram
//callback应接受bool类型的参数
function alarmDetect(name, callback) {
    chrome.alarms.getAll(function(list) {
        var flag = false
        for (item in list) {
            if (name == list[item].name) {
                flag = true
                break;
            }
        }

        callback(flag)
    })
};

//设置windows属性
chrome.windows.getCurrent(function(currentWindow) {
    Ltools.windowsInfo = currentWindow
});
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

//初始化一些设置
function init() {
    var config = request.getConfig()
    if (config.result != msg.rightResult) {
        return;
    }
    for (item in config.info) {
        Ltools.config[item] = config.info[item]
    }
}
init();