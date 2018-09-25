//发送请求的js
var request = {
    domain: 'https://post.s',
    //设置一些请求配置
    ajax: function(url, method, async, data) {
        var r = {}
        $.ajax({
            url: this.domain + url,
            type: method,
            data: data,
            async: async,
            success: function(data) {
                r = data
                if ("string" == typeof(r)) {
                    r = JSON.parse(r)
                }
            },
            error: function(data) {

            }
        })
        return r;
    },
    //获取时间戳
    timestamp: function() {
        return this.ajax('/timestamp', 'GET', false, {})
    },
    //注册
    regster: function(mail, pass) {
        return this.ajax('/user', 'PUT', false, { mail: mail, pass: pass })
    },
    //登录
    login: function(mail, pass) {
        return this.ajax('/login', 'POST', false, { mail: mail, pass: pass })
    },
    //更新url
    updateURL: function(urlText, tokenObj) {
        return this.ajax('/myurl', 'POST', false, { token: tokenObj.token, url: urlText, user_id: tokenObj.userID })
    },
    //获取url
    getURL: function(tokenObj) {
        return this.ajax('/myurl', 'GET', false, { token: tokenObj.token, user_id: tokenObj.userID })
    },
    //todo 需要获取其他人的url
    getLookURL: function(tokenObj, count) {
        return this.ajax('/lookurl', 'GET', false, { token: tokenObj.token, user_id: tokenObj.userID, count: count })
    },
    //提交look的url
    lookPost: function(tokenObj, list) {
        return this.ajax('/lookurl', 'PUT', false, { token: tokenObj.token, url: list, user_id: tokenObj.userID })
    },
    //获取config
    getConfig: function() {
        return this.ajax('/config', 'GET', false, {})
    }
}