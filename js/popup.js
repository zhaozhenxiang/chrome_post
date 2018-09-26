$(function() {

    // 加载设置
    var defaultConfig = { color: 'white' }; // 默认配置
    chrome.storage.sync.get(defaultConfig, function(items) {
        document.body.style.backgroundColor = items.color;
    });

    // 初始化国际化
    $('#test_i18n').html(chrome.i18n.getMessage("helloWorld"));


});

// 打开后台页
$('#open_background').click(e => {
    window.open(chrome.extension.getURL('background.html'));
});

// 调用后台JS
$('#invoke_background_js').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.testBackground();
});

// 获取后台页标题
$('#get_background_title').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    alert(bg.document.title);
});

// 设置后台页标题
$('#set_background_title').click(e => {
    var title = prompt('请输入background的新标题：', '这是新标题');
    var bg = chrome.extension.getBackgroundPage();
    bg.document.title = title;
    alert('修改成功！');
});

// 自定义窗体大小
$('#custom_window_size').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        var startLeft = 10;
        chrome.windows.update(currentWindow.id, {
            left: startLeft * 10,
            top: 100,
            width: 800,
            height: 600
        });
        var inteval = setInterval(() => {
            if (startLeft >= 40) clearInterval(inteval);
            chrome.windows.update(currentWindow.id, { left: (++startLeft) * 10 });
        }, 50);
    });
});

// 最大化窗口
$('#max_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        // state: 可选 'minimized', 'maximized' and 'fullscreen' 
        chrome.windows.update(currentWindow.id, { state: 'maximized' });
    });
});


// 最小化窗口
$('#min_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        // state: 可选 'minimized', 'maximized' and 'fullscreen' 
        chrome.windows.update(currentWindow.id, { state: 'minimized' });
    });
});

// 打开新窗口
$('#open_new_window').click(() => {
    chrome.windows.create({ state: 'maximized' });
});

// 关闭全部
$('#close_current_window').click(() => {
    chrome.windows.getCurrent({}, (currentWindow) => {
        chrome.windows.remove(currentWindow.id);
    });
});

// 新标签打开网页
$('#open_url_new_tab').click(() => {
    chrome.tabs.create({ url: 'https://www.baidu.com' });
});

// 当前标签打开网页
$('#open_url_current_tab').click(() => {
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, { url: 'http://www.so.com' });
    });
});

// 获取当前标签ID
$('#get_current_tab_id').click(() => {
    getCurrentTabId(tabId => {
        alert('当前标签ID：' + tabId);
    });
});

// 高亮tab
$('#highlight_tab').click(() => {
    chrome.tabs.highlight({ tabs: 0 });
});

// popup主动发消息给content-script
$('#send_message_to_content_script').click(() => {
    sendMessageToContentScript('你好，我是popup！', (response) => {
        if (response) alert('收到来自content-script的回复：' + response);
    });
});

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('收到来自content-script的消息：');
    console.log(request, sender, sendResponse);
    sendResponse('我是popup，我已收到你的消息：' + JSON.stringify(request));
});

// popup与content-script建立长连接
$('#connect_to_content_script').click(() => {
    getCurrentTabId((tabId) => {
        var port = chrome.tabs.connect(tabId, { name: 'test-connect' });
        port.postMessage({ question: '你是谁啊？' });
        port.onMessage.addListener(function(msg) {
            alert('收到长连接消息：' + msg.answer);
            if (msg.answer && msg.answer.startsWith('我是')) {
                port.postMessage({ question: '哦，原来是你啊！' });
            }
        });
    });
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
    chrome.windows.getCurrent(function(currentWindow) {
        chrome.tabs.query({ active: true, windowId: currentWindow.id }, function(tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function(response) {
            if (callback) callback(response);
        });
    });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
    getCurrentTabId((tabId) => {
        chrome.tabs.executeScript(tabId, { code: code });
    });
}


// 演示2种方式操作DOM

// 修改背景色
$('#update_bg_color').click(() => {
    executeScriptToCurrentTab('document.body.style.backgroundColor="red";')
});

// 修改字体大小
$('#update_font_size').click(() => {
    sendMessageToContentScript({ cmd: 'update_font_size', size: 42 }, function(response) {});
});

// 显示badge
$('#show_badge').click(() => {
    chrome.browserAction.setBadgeText({ text: 'New' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
});

// 隐藏badge
$('#hide_badge').click(() => {
    chrome.browserAction.setBadgeText({ text: '' });
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
});

// 显示桌面通知
$('#show_notification').click(e => {
    chrome.notifications.create(null, {
        type: 'image',
        iconUrl: 'img/icon.png',
        title: '祝福',
        message: '骚年，祝你圣诞快乐！Merry christmas!',
        imageUrl: 'img/sds.png'
    });
});

$('#check_media').click(e => {
    alert('即将打开一个有视频的网站，届时将自动检测是否存在视频！');
    chrome.tabs.create({ url: 'http://www.w3school.com.cn/tiy/t.asp?f=html5_video' });
});


$('#ajax1').click(e => {
    $.get('http://baidu.com', function(data, status) {
        alert("Data:" + data + "\nStatus:" + status);
    })
});

$('#callBackFunc').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.testCount(2); //test()是background中的一个方法
})
$('#tools').click(e => {
    Ltools.createWindow()
});
$('#tools1').click(e => {

    Ltools.openURLInNewTab('http://baidu.com')
        // Ltools.openURLInThisTab('http://baidu.com')
    Ltools.currentCallback(tabId => {
        alert(tabId);

        // tabIdTmp = tabId
    })

    chrome.tabs.get(2874, function(tab) {
        console.log(tab);
    });
    // Ltools.callBackAnyTab(2874, function(tab) { console.info(tab.update({ url: "http://baidu.com" })) })
    // console.info(chrome.tabs)
    console.log(chrome.tabs)
    Ltools.getTabsCount(tabNum => { alert(tabNum) })
})

$('#tools2').click(e => {
    var bg = chrome.extension.getBackgroundPage();
    bg.showvar(); //test()是background中的一个方法
});


//开始demo
$('#start').click(e => {
    msg.show('')
    e.disabled = true
    var bg = chrome.extension.getBackgroundPage();
    // bg.testCount(2);
    bg.startLook();
    e.disabled = false
    successDom();
    // msg.show(msg.dict('startLook'))
})

//停止demo
$('#stop').click(e => {
    e.disabled = true
    msg.show('')
    var bg = chrome.extension.getBackgroundPage();
    // bg.stopInterval();
    bg.stopLook();
    msg.show(msg.dict('failedLook'))
    e.disabled = false
})

//注册按钮
$('#register_b').click(e => {

    e.disabled = true
    msg.show('')
    var bg = chrome.extension.getBackgroundPage();
    var r = bg.regster($('#mail1').val(), $('#pass1').val())
    if (false == r.flag) {
        msg.notice(r.msg)
        return
    }
    //只显示登录dom
    msg.show(msg.dict('needLogin'));
    msg.onlyShow('login')

    e.disabled = false
})

//显示登录dom
$('.showLogin').click(e => {
    e.disabled = true
    showLogin()
    e.disabled = false
});

function showLogin() {
    logout();
    msg.show('')
    msg.onlyShow('login')
}
//显示注册dom
$('.showRegister').click(e => {
    e.disabled = true
    showRegister()
    e.disabled = false
});

function showRegister() {
    logout();
    msg.onlyShow('register')
    msg.show(msg.dict('loginOrRegister'));
}

//登录按钮
$('#login_b').click(e => {
    e.disabled = true
    msg.show('')
    var bg = chrome.extension.getBackgroundPage();
    var r = bg.login($('#mail2').val(), $('#pass2').val())
    if (false == r.flag) {
        msg.notice(r.msg)
        return
    }
    //只显示登录dom
    msg.show(msg.dict('loginSuccess'));
    Ltools.save(Ltools.saveKey.mail, $('#mail2').val())
    msg.onlyShow('controller')
    e.disabled = false
    successDom()
})

//显示修改url的datatabledom
$('#updateURL').click(e => {

    e.disabled = true
    msg.show('')
        /*  Ltools.get(Ltools.saveKey.url, function(data) {
              //没有写入到storage中的话需要从ajax中获取然后写入到storage中
              if (undefined == data) {
                  var bg = chrome.extension.getBackgroundPage();
                  var r = bg.getURL(function(json) {
                      if (msg.rightResult != json.result) {
                          return
                      }
                      var urls = ''
                      for (item in json.info) {
                          if (undefined == json.info[item]['url']) {
                              continue;
                          }
                          urls += json.info[item]['url'] + '\r\n'
                      }
                      Ltools.save(Ltools.saveKey.url, urls)
                      $('#url').val(urls)
                  })
                  return
              }

              $('#url').val(data)
          })
          */
    var bg = chrome.extension.getBackgroundPage();
    var r = bg.getURL(function(json) {
        if (msg.rightResult != json.result) {
            errorResultHandle(json)
            return
        }
        var urls = ''
        for (item in json.info) {
            if (undefined == json.info[item]['url']) {
                continue;
            }
            urls += json.info[item]['url'] + '\r\n'
        }
        Ltools.save(Ltools.saveKey.url, urls)
        $('#url').val(urls)
    })

    msg.onlyShow('dataTable')

    e.disabled = false

});
//判断token是否过期
//过期的话处理一些事情
function errorResultHandle(json) {
    if (msg.needLoginCode.indexOf(parseInt(json.result)) > -1) {
        logout()
    }
}
//主动调用过期
function logout() {
    Ltools.clearAllStorage()
    var bg = chrome.extension.getBackgroundPage();
    bg.stopLook()
    msg.show(msg.dict('needLogin'))
    msg.onlyShow('register')
}
//使用new tab打开说明文档
$('#readme').click(e => {
    e.disabled = true
    var url = request.domain + '/readme.html'
    chrome.tabs.create({ url: url })
    e.disabled = false
});
//修改url
$('#updateURL_b').click(e => {
    e.disabled = true
    msg.show('')
    var bg = chrome.extension.getBackgroundPage();
    var r = bg.updateURL($('#url').val(), function(json) {
        if (msg.rightResult != json.result) {
            msg.notice(msg.msg(json))
            errorResultHandle(json)
            return
        }
        msg.show(msg.msg(json));
        //todo 这里需要考虑是否应该应该将本地数据写入本地。如果写入可能导致本地数据与网络数据不同步的问题
        // Ltools.save(Ltools.saveKey.url, $('#url').val())
        //只显示登录dom
        msg.onlyShow('controller')
    })

    e.disabled = false
});
//页面初始化
$(document).ready(function() {
    //0-6点不能使用该扩展
    if (Ltools.timestampIsError()) {
        msg.show(msg.dict('hoursError'))
        return
    }

    var bg = chrome.extension.getBackgroundPage();
    var timestamp = bg.timestamp();
    //要求本地时间不能与网络时间差别300秒
    if (0 != timestamp && Math.abs(timestamp - (new Date()).getTime() / 1000) > 60 * 5) {
        msg.show(msg.dict('timestampError'));
        return
    }

    //没有找到token时让用户登录或者注册
    //找到token时显示controllerdom
    Ltools.get(Ltools.saveKey.token, function(data) {
        if (undefined == data) {
            // msg.onlyShow('register')
            showLogin()
            msg.show(msg.dict('loginOrRegister'));

            return
        }
        msg.onlyShow('controller')
    })
    successDom()
})

//成功运行之后的提示
function successDom() {
    var bg = chrome.extension.getBackgroundPage();
    //显示邮箱
    Ltools.get(Ltools.saveKey.mail, function(data) {
        if (undefined == data) {
            return
        }
        $('#name').html(data);
        //obj => {} or {viewedCount: "0"} 
        bg.getViewedCount(function(obj) {
            if (undefined == obj['viewedCount']) {
                $('#viewedCount').html(0)
                return
            }

            $('#viewedCount').html(obj['viewedCount'])
        });
        //运行成功的提示
        bg.alarmDetect(Ltools.alarmLook, function(boolFlag) {
            if (true == boolFlag) {
                msg.show(msg.dict('startLook'))
            } else {
                msg.show(msg.dict('failedLook'))
            }
        })

    })
}