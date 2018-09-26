//函数集合
var Ltools = {
    //config
    config: { requestPercent: 1 },
    //每次ajax获取的数量
    todoOpenLength: 40,
    //todoOpen变量写入次数
    //该变量未使用
    todoOpenAppendCount: 0,
    //待打开的url    
    //该变量需要写入
    todoOpen: [],
    //获取待打开的url
    //一次从网络上获取50条url，一次只能打开2条url
    //需要本地设置偏移量，偏移量为tabIDURL中最后一条url的id
    getTodoOpenUrl: function(count) {
        //todo 需要考虑这里是否应该使用chrome.storage.sync.get
        //直接使用todoOpen全局变量
        return this.todoOpen.slice(this.lookCount % this.todoOpen.length, count + this.lookCount % this.todoOpen.length);

        var url = [];
        for (i = 0; i < count; i++) {
            url.push({ url: "http://baidu.com", id: i })
        }
        return url
    },
    //已经打开的url
    opened: [],
    //设置已经打开的url
    //达到个数之后发起POST
    setOpenUrl: function(url) {

    },
    //定时任务的实例
    //todo 是否可以根据该值是否为Null来判断定时器是否运行呢？
    //todo 考虑使用https://crxdoc-zh.appspot.com/extensions/alarms
    interval: null,
    //定时任务运行的时间间隔
    intervalTime: 5000,
    //定时任务运行的次数
    intervalCount: 0,
    //将要在当前页面打开的url
    // currentURL: null,
    //当前windows中tab能够打开的个数,
    //用户可以设置
    tabMax: 4,
    //挖矿cpu的百分比
    percent: 0.2,
    //已经浏览的个数
    lookCount: 0,
    //tabID和URL的映射关系
    //id为ajax response中与url一起组成信息
    //{ 'tabid': tabId, 'url': urls[i]['url'], id: urls[i]['id'] }
    tabIDURL: [],
    windowsID: chrome.windows.WINDOW_ID_CURRENT,
    windowsInfo: {},
    //关闭全部
    closeAll: function() {
        chrome.windows.getCurrent({}, (currentWindow) => {
            chrome.windows.remove(currentWindow.id);
        });
    },
    //创建窗口,另外一个chrome进程
    createWindow: function() {
        chrome.windows.create({ state: 'maximized' });
    },
    //在新tab中打开网页
    openURLInNewTab: function(url1) {
        chrome.tabs.create({ url: url1 });
    },
    //在当前tab中打开网页
    openURLInThisTab: function(url1) {
        // Ltools.currentURL = url1
        this.currentCallback(tabId => {
            chrome.tabs.update(tabId, { url: url1 });
        });
    },
    //在当前tab上执行callback
    currentCallback: function(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (callback) callback(tabs.length ? tabs[0].id : null);
        });
    },
    //获取当前tab的index
    getTabsIndex: function(callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

            if (callback) callback(tabs[0].index);
        });
    },
    //在指定tabid上执行callback
    //修改指定tab的url为sogou
    //callBackAnyTab(3075, {url:'http://sogou.com'}, function(tab){})
    callBackAnyTab: function(tabId, updateProperties, callback) {
        chrome.tabs.update(tabId, updateProperties, function(tab) {
            if (callback) callback(tab);
        });
    },
    //获取指定tabid的信息
    getTabInfo: function(tabID, callback) {
        chrome.tabs.get(tabID, function(tab) {
            callback(tab)
        })
    },
    //存值前缀
    saveKeyPrifxi: 'chrome_post',
    //存放token的key
    saveKey: { token: 'token', url: 'url', mail: 'mail', viewedCount: 'viewedCount' },
    //存值的方式:
    //使用storage存值
    save: function(k, v) {
        var key = this.saveKeyPrifxi + k
        var obj = {}
        obj[key] = v
        chrome.storage.sync.set(obj)
    },
    //使用storage存值
    get: function(k, callback) {
        chrome.storage.sync.get(this.saveKeyPrifxi + k, function(data) {
            //data 为存入对象
            if (undefined == data[Ltools.saveKeyPrifxi + k]) {
                callback(undefined)
                return
            }
            callback(data[Ltools.saveKeyPrifxi + k])
        })

    },
    //清除全部key
    clearAllStorage: function() {
        for (item in Ltools.saveKey) {
            if (undefined == Ltools.saveKey[item]) {
                continue;
            }
            chrome.storage.sync.remove(Ltools.saveKeyPrifxi + Ltools.saveKey[item])
        }
    },
    //时间段是否服务
    timestampIsError: function() {
        var hour = (new Date()).getHours()
        return 0 > hour && 6 < hour
    },
    //alaram的名称
    alarmLook: 'look',
    //alaram的调用时间间隔
    alaraLookMinutes: 1,
    //alarm提交的名称
    alarmPost: 'post',
    alaraPostMinutes: 5,
    //写入todoOpen的名称
    appendURL: 'append',
    //写入todoOpen的时间间隔
    appendURLMinutes: 10,
}