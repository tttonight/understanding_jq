
# 一、基础概念

## 闭包 && 匿名函数
```js
//closure
function addFunc(b){
    var a =1;
    return function(){
        return a+b;
    }
}

//anonymous function
(function(){
    var func = function(){
        console.log('function');
    };
    func();
    console.log('i am  an anonymous function')
})();
```
### 匿名函数

>匿名函数使用场景

- 减少全局变量使用
```js
var x = 1;
var y = 2;
var add = function(a,b){
    return a+b;
};
console.log(add(x,y));

//better
+function(){
    var x = 1;
    var y = 2;
    var add = function(a,b){
        return a+b;
    };
    console.log(add(x,y));
}();
```
- 构造"块"作用域
```js
function validate(x){
    if(x == 1){
        var name = 'right';
    }else{
        var name  =  'wrong';
    }
    console.log(name);// if x==1  expected `right`
}


// create a block scope
 function validate(x){

     (function(){
        if(x == 1){
            var name = 'right'
        }else{
            var name  =  'wrong'
        }
     })()

    console.log(typeof name)
}
```


>``闭包`` 是指有权访问另一个函数作用域中的变量的 `函数`

 ### 利用闭包进行模块化编程

```js
/*
 * common header
 */
var Header = (function(){
    var _title =  'WIFI'; 
    return {
        init:function(){
            console.log('<h1>'+_title+'</h1>');
        },
        getTitle:function(){
            return _title;
        },
        setTitle:function(title){
            _title  = title;
        }
    }
})()
```
> 利用闭包解决变量引用问题

```js
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
```


