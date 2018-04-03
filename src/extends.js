/*

### $.extend & $.fn.extend

$.extend 扩展 jQuery类方法
$.fn.extend   扩展jQuery实例方法


*/
$(document).ready(function () {

    /**
     * 传入一个object参数
     */
    $.extend({
        sayHello: function () {
            console.log('hello')
        }
    });
    $.sayHello();

    /**
     * 传入两个或以上object参数
     */

    var obj = $.extend({}, { name: 'zenggr' }, { id: '123' });
    console.log(obj);

    /**
     * 第一个参数为boolan值
     */

    var obj1 = $.extend(true, { name: 'zenggr', car: { color: 'blue', chair: { color: 'gray', price: 234 } } }, { id: '123', name: 'xiaozeng', car: { color: 'blue', chair: { color: 'red' } } });
    console.log(obj1);

    var obj2 = $.extend(false, { name: 'zenggr', car: { color: 'blue', chair: { color: 'gray', price: 234 } } }, { id: '123', name: 'xiaozeng', car: { color: 'blue', chair: { color: 'red' } } });
    console.log(obj2);


    $.fn.extend({
        info: function (msg) {
            console.log(msg)
        }
    });

    $('#testEvent').info('ha ha ha ...');




});