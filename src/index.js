
// 匿名函数的4种写法
(function () {
    console.log('I am a anonymous functions')
})();


!function () {
    console.log('I am a anonymous functions 2')
}();


+ function () {
    console.log('I am a anonymous functions 3')
}();

(function () { console.log('I am a anonymous functions 4') }())

// js没有像c++那种的块级作用域
function validate(x) {
    if (x == 1) {
        var name = 'right'
    } else {
        var name = 'wrong'
    }
    console.log(name) //right
}

validate(1)

// create a block scope
function validateBlock(x) {

    (function () {
        if (x == 1) {
            var rs = 'right'
        } else {
            var rs = 'wrong'
        }
    })(); //匿名函数
    console.log(typeof rs) //undefined
}

validateBlock(1)



//这是一种闭包，代码可以这样写
var Header = (function () {
    var _title = 'WIFI'
    return {
        init: function () {
            console.log('<h1>' + _title + '</h1>')
        },
        getTitle: function () {
            return _title;
        },
        setTitle: function (title) {
            _title = title;
        }
    }
})();

Header.init();
Header.setTitle('Demo');
Header.init();







function createFunctions() {
    var result = new Array();
    for (var i = 0; i < 10; i++) {
        result[i] = function () {
            return i;
        };
    }
    return result;
}
var funcs = createFunctions();
for (var i = 0; i < funcs.length; i++) {
    console.log(funcs[i]());
}

//优化
function createFunctions2() {
    var result = new Array();
    for (var i = 0; i < 10; i++) {
        result[i] = (function (a) {
            return function () {
                return a
            }
        })(i);
    }
    return result;
}
var funcs = createFunctions2();
for (var i = 0; i < funcs.length; i++) {
    console.log(funcs[i]());
}