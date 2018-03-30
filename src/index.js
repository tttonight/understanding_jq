
var Engine = (function () {
    var _engine = {};

    var validator = function (selector) {
        var idTester = /^#/
        if (idTester.test(selector)) {
            return 1
        }

        return 0;

    }
    _engine.getSelectedDom = function (selector) {
        var type = validator(selector);
        switch (type) {
            case 1:
                var id = selector.substring(1, selector.length)
                console.log(id);
                return document.getElementById(id); // 判断如果是#开头，则用getElementById
            default:
                return null
        }
    };
    return _engine;
})();

//传入css选择器，调用SimpleJQ('#id')返回SimpleJQ
function SimpleJQ(selector) {
    //这里进行判断，是否是字符串
    if (typeof selector !== 'string')
        throw new Error('invalid selector')
    // 这里是用来获取的元素的dom
    var ele = Engine.getSelectedDom(selector);
    if (!ele) {
        throw new Error('no element was selected')
    }
    this.ele = ele;
    console.log(ele)
}
SimpleJQ.prototype.css = function () {
    // 这里由于我们要做的css()方法的功能参数的传递方式有3种：(1).css('width') / (2).css('width', '20px') / (3).css({'width':'20px','color':'red'})

    // 这是第二种
    if (arguments.length > 1) { // 传的参数不固定，所以是用arguments
        this.ele.style[arguments[0]] = arguments[1];
        return this; //return this 是作用域支持链式调用，返回它本身
    }
    // 这是第一和第三种
    if (arguments.length == 1) {
        // 判断传入的参数是string，即第一种
        if (typeof arguments[0] === 'string')
            return this.ele.style[arguments[0]];
        // 是object则是第三种
        if (typeof arguments[0] == 'object' && Object.prototype.toString.call(arguments[0]) !== "[object Array]") { // 后面一个是确保不是数组，数组typeof也是object
            for (var p in arguments[0]) {
                this.ele.style[p] = arguments[0][p];
            }
            return this;
        }
    }
}


// 支持静态工具方法  ，例如$.proxy  $.ajax
SimpleJQ.ajax = function (options) {
    // url是一定要传的参数
    if (!options.url) {
        throw new Error('no url is supply')
    }
    var url = options.url;
    var type = options.type ? options.type : 'get'; // 默认是get方法

    var request = new XMLHttpRequest();
    console.log(url, type)
    request.open(type, url);
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200)
                options.success(JSON.parse(request.responseText));
            else {
                throw new Error(request.status)
            }
        }
    }

    request.onerror = function () {

        options.error(new Error('something err'))
    }
    request.send()
}


window.$ = window.SimpleJQ = SimpleJQ; // 直接用$当simplejq
console.log($)

var sjq = new SimpleJQ('#main');
console.log(sjq)

sjq.css('color', 'red').css({
    fontSize: '14px',
    padding: '16px;'
})
console.log(sjq.css('color'))
SimpleJQ.ajax({
    url: 'test.json',
    type: 'GET',
    success: function (json) {
        console.log(json)
    },
    error: function (e) {
        console.error(e)
    }
});