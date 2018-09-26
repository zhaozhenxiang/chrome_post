//显示的text
var msg = {
    //关于code的映射
    code: { 1000: "没有找到登录信息即用户提交信息没有携带用户信息", 1001: "登录信息错误即登录时提交用户名和密码不匹配", 1004: "TOKEN信息错误", 2000: "没有权限操作", 2001: "没有找到想要操作的资源即修改信息没有找到该信息", 2002: "操作失败", 2003: "操作成功", 2004: "操作成功并且文件上传失败", 2005: "该资源已存在", 2006: "用户不存在", 2007: "资源超过上限", 2008: "文件太大", 2009: "文件格式不对", 3000: "格式错误", 3001: "码值错误", 3002: "码过期", 3003: "码值可以使用", 4000: "字段缺少", 4001: "字段不在预期范围", 5000: "已存在该用户信息", 6000: "推送失败", 6001: "推送时间间隔太短", 7000: "签名失败", 8000: "名称重复", 8001: "名称可以使用" },
    //需要重新登录的code
    needLoginCode: [1004],
    //成功的code
    rightResult: 2003,
    //默认的提示
    defaultMsg: '',
    //显示msg
    msg: function(json) {

        if (undefined == typeof this.code[parseInt(json.result)]) {
            return json.msg
        }

        return this.code[parseInt(json.result)]
    },
    //显示提醒
    //todo 这里可以考虑一下是否使用layer这种弹出层
    show: function(str) {
        // alert(str)
        $('#msg').html(str)
    },
    //显示提醒
    notice: function(str) {
        this.show(str)
    },
    //设置backgroud返回给popup的object
    setParam: function(flag, msg) {
        return { flag: flag, msg: msg }
    },
    //全部的domid
    allDomID: ['login', 'controller', 'register', 'dataTable'],
    //只显示一个dom
    onlyShow: function(domID) {
        for (item in this.allDomID) {
            if (this.allDomID[item] == domID) {
                $('#' + this.allDomID[item]).show()
            } else {
                $('#' + this.allDomID[item]).hide()
            }
        }

    },
    //dict的映射
    dictMapping: { needLogin: '请登录', loginOrRegister: '请登录或者注册之后登录', timestampError: '请修改本地时间为北京时间', hoursError: '目前时间段不提供服务', loginSuccess: '成功登录', startLook: '运行成功将自动浏览网页', failedLook: '目前没有开始自动浏览网页' },
    //返回映射字符串
    dict: function(key) {
        if (undefined == this.dictMapping[key]) {
            return null
        }

        return this.dictMapping[key]
    }

}