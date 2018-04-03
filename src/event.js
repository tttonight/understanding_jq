

/**
 
## jquery 事件处理

- 事件的命名空间
- 编程式事件触发
- 利用$.Event构造自定义事件
> 扩展： 如何开发一个事件系统？



 */






$(document).ready(function () {
    /**
     * 一个元素绑定多个事件
     * 事件的命名空间有利于更好地管理事件的订阅和派发
     */
    $('#testEvent').on('click.testEvent1', function (evt) {
        console.log('click.testEvent1');
    });

    $('#testEvent').on('click.testEvent2', function (evt) {
        console.log('click.testEvent2');
    });

    /**
     * 编程式事件触发
     */
    $('#testEvent').trigger('click.testEvent1');
    $('#testEvent').trigger('click.testEvent2');




    /**
     *  利用$.Event 构造自定义事件
     */
    $('body').on('myevent', function (e) {
        console.log(e.name)
    });

    var e = $.Event('myevent', { name: 'zenggr' });
    $('body').trigger(e);

});