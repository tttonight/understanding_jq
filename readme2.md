# jquery插件开发(扩展jquery)
- 基于$.extend (全局性的插件) 调用的形式$.ajax()
- 基于$.fn.extend 调用的形式$('#xxx').css()


## 室内热力图插件开发（基于原型的方法）jquery.indoorheatmap.js
需求: 通过用户提供的数据，生成一个室内热力图的可视化效果，支持地图缩放，平移，适应画布等效果;

分析

1. 通过对用户提供的室内地图（svg）和热力图层的叠加，实现可视化效果
2. 通过监听鼠标的一些事件，实现地图的交互操作


### 插件基本框架
```js
   //插件模块   
   (function($){
     //$.fn == jQuery.prototype
     // 所有jquery对象共享其属性 
     $.fn.indoorHeatMap=function(){
          console.log(this) // jquery instance
          console.log('testing....');
     }
   })(jQuery)//缩短变量查找时间,将jq传进去，使用的时候调用的是在这个匿名函数里面的jq，是局部变量，减小查找全局变量时所浪费的时间

  //  $.fn.extend({
  //     indoorHeatMap:function(){
  //         console.log(this) // jquery instance
  //         console.log('testing....');
  //     }
  //  })
```

### 支持链式调用和获取实际的dom



```js
   //插件模块   
   (function($){
     //$.fn == jQuery.prototype
     // 所有jquery对象共享其属性 
     $.fn.indoorHeatMap=function(){
          console.log(this) // jquery instance
          console.log('testing....');
          return this.each(function(){
              console.log(this);
              var $this = $(this;)
          })
     }
   })(jQuery)//缩短变量查找时间
```


### 参数处理



```js
   //插件模块   
   (function($){

    //插件默认参数
     var DEFAULT = {
        backgroundColor:'transparent',//画布背景颜色
        fit:true,//是否适应画布
     }
     $.fn.indoorHeatMap=function(option){
       
           //合并参数,增加或覆盖默认的参数,浅合并
          var options = $.extend({},DEFAULT,option); 
          console.log(options);
          return this.each(function(){
              console.log(this);
              var $this = $(this);
          });
     }
   })(jQuery)//
```
   ### 实现插件业务

   ```js
   //插件模块   
   (function($){


    var IndoorHeatMap = function($ele,options){
         this.$ele = $ele;
         this.options = options;
    }


    //插件默认参数
     var DEFAULT = {
        backgroundColor:'transparent',//画布背景颜色
        fit:true,//是否适应画布
     }
     $.fn.indoorHeatMap=function(option){
       
           //合并参数,增加或覆盖默认的参数
          var options = $.extend({},DEFAULT,option); 
          console.log(options);
          return this.each(function(){
              console.log(this);
              var $this = $(this);
              new IndoorHeatMap($this,option)
          });
     }
   })(jQuery)//
   ```
### 初始化插件结构和样式
```js
//插件模块   
(function ($) {


    var IndoorHeatMap = function ($ele, options) {
        this.$ele = $ele;
        this.options = options;
        if (!this.options.svgUrl)//svg地图图层是必须参数
            throw new Error('svg map is require!!!');
        this.init();
    }


    /**
     * 初始化插件结构和样式
     * 显示可视化效果
     */
    IndoorHeatMap.prototype.init = function () {
        this.$ele.css('backgroundColor', this.options.backgroundColor);
        this.$svgLayer = $('<div class="ih"><img src="' + this.options.svgUrl + '"></div>').appendTo(this.$ele);
        this.$heatMapLayer = $('<div class="ih"></div>').appendTo(this.$ele);
        var that = this;
        var heatmap = h337.create({
            container: that.$heatMapLayer[0]
        });
        var data = this.options.data || [];
        heatmap.setData({
            max: 5,
            data: data
        });
        this.enablePanZoom(this.options.disabled);
    }
 IndoorHeatMap.prototype.enablePanZoom=function(disabled){

 }

    //插件默认参数
    var DEFAULT = {
        backgroundColor: 'transparent',//画布背景颜色
        fit: true,//是否适应画布
    }
    $.fn.indoorHeatMap = function (option) {

        //合并参数,增加或覆盖默认的参数
        var options = $.extend({}, DEFAULT, option);
        console.log(options);
        return this.each(function () {
            console.log(this);
            var $this = $(this);
            new IndoorHeatMap($this, options);
        });
    }
})(jQuery)//
```


### 事件交互实现

```js

//插件模块   
(function ($) {


    var IndoorHeatMap = function ($ele, options) {
        this.$ele = $ele;
        this.options = options;
        if (!this.options.svgUrl)//svg地图图层是必须参数
            throw new Error('svg map is require!!!');
        this.init();
    }


    /**
     * 初始化插件结构和样式
     * 显示可视化效果
     */
    IndoorHeatMap.prototype.init = function () {
        this.$ele.css('backgroundColor', this.options.backgroundColor);
        this.$svgLayer = $('<div class="ih"><img src="' + this.options.svgUrl + '"></div>').appendTo(this.$ele);
        this.$heatMapLayer = $('<div class="ih"></div>').appendTo(this.$ele);
        var that = this;
        var heatmap = h337.create({
            container: that.$heatMapLayer[0]
        });
        var data = this.options.data || [];
        heatmap.setData({
            max: 5,
            data: data
        });
        this.enablePanZoom(this.options.disabled);
    }

    IndoorHeatMap.prototype.enablePanZoom = function (disabled) {

        /**
         * todo
         * -  注意浏览器兼容性处理
         * -  优化算法和参数，让缩放平移更加平滑
         */
        var lastFactor = 1,
            originTX = 0,
            originTY = 0,
            offset = [],
            origin = [],
            status = 0;

        if (!disabled) {

            this.$ele[0].onmousewheel = $.proxy(function (event) {  //proxy作用是用于this能赋值给画布的对象
                event.preventDefault();
                event.stopPropagation();

                var scrollFactor = event.wheelDelta / 1200;
                if (Math.abs(scrollFactor) > 1) {
                    return;
                }
                var testFactor = parseFloat(lastFactor) + parseFloat(scrollFactor);
                testFactor = testFactor.toFixed(1);
                if (testFactor > 2 || testFactor < 0.5) {
                    return;
                }
                lastFactor = testFactor;
                var transform = `translate(${originTX}px,${originTY}px) scale(${testFactor})`;
                this.$heatMapLayer[0].style.transform = this.$svgLayer[0].style.transform = transform;
            }, this);


            this.$ele[0].onmousedown = $.proxy(function (event) {
                status = 1;//dragging
                origin[0] = event.clientX;
                origin[1] = event.clientY;
                if (status == 1)
                    this.$ele[0].style.cursor = 'move';
            }, this);

            this.$ele[0].onmouseup = $.proxy(function (event) {
                status = 0;//stop dragging
                originTX = offset[0];
                originTY = offset[1];
                this.$ele[0].style.cursor = 'default';
            }, this);

            this.$ele[0].onmousemove = $.proxy(function (event) {

                if (status == 1) {
                    offset[0] = event.clientX - origin[0] + originTX;
                    offset[1] = event.clientY - origin[1] + originTY;
                    this.$heatMapLayer[0].style.transform = this.$svgLayer[0].style.transform = 'scale(' + lastFactor + ') translate(' + offset[0] + 'px,' + offset[1] + 'px)';
                }

            }, this);
        }
    }

    //插件默认参数
    var DEFAULT = {
        backgroundColor: 'transparent',//画布背景颜色
        fit: true,//是否适应画布
        disabled: false
    }
    $.fn.indoorHeatMap = function (option) {

        //合并参数,增加或覆盖默认的参数
        var options = $.extend({}, DEFAULT, option);
        console.log(options);
        return this.each(function () {
            console.log(this);
            var $this = $(this);
            new IndoorHeatMap($this, options);
        });
    }
})(jQuery)//

```


### 扩展更多的公共api
```js
//例如:
$('#test').indoorHeatMap('hide'); //隐藏插件
$('#test').indoorHeatMap('destroy'); //销毁插件
...more
```

`需要注意一下几点`

- api以字符串的方式发布，那么option可以分为两种情况，字符串的时候就不需要进行参数合并
- 扩展的indoorHeatMap会被调用两次，加入缓存，确保插件不被初始化多次！

```js
//插件模块   
(function ($) {


    var IndoorHeatMap = function ($ele, options) {
        this.$ele = $ele;
        this.options = options;
        if (!this.options.svgUrl)//svg地图图层是必须参数
            throw new Error('svg map is require!!!');
        this.init();
    }


    /**
     * 初始化插件结构和样式
     * 显示可视化效果
     */
    IndoorHeatMap.prototype.init = function () {
        this.$ele.css('backgroundColor', this.options.backgroundColor);
        this.$svgLayer = $('<div class="ih"><img src="' + this.options.svgUrl + '"></div>').appendTo(this.$ele);
        this.$heatMapLayer = $('<div class="ih"></div>').appendTo(this.$ele);
        var that = this;
        var heatmap = h337.create({
            container: that.$heatMapLayer[0]
        });
        var data = this.options.data || [];
        heatmap.setData({
            max: 5,
            data: data
        });
        this.enablePanZoom(this.options.disabled);
    }




    IndoorHeatMap.prototype.enablePanZoom = function (disabled) {

        /**
         * todo
         * -  注意浏览器兼容性处理
         * -  优化算法和参数，让缩放平移更加平滑
         */
        var lastFactor = 1,
            originTX = 0,
            originTY = 0,
            offset = [],
            origin = [],
            status = 0;

        if (!disabled) {

            this.$ele[0].onmousewheel = $.proxy(function (event) {
                event.preventDefault();
                event.stopPropagation();

                var scrollFactor = event.wheelDelta / 1200;
                if (Math.abs(scrollFactor) > 1) {
                    return;
                }
                var testFactor = parseFloat(lastFactor) + parseFloat(scrollFactor);
                testFactor = testFactor.toFixed(1);
                if (testFactor > 2 || testFactor < 0.5) {
                    return;
                }
                lastFactor = testFactor;
                var transform = `translate(${originTX}px,${originTY}px) scale(${testFactor})`;
                this.$heatMapLayer[0].style.transform = this.$svgLayer[0].style.transform = transform;
            }, this);


            this.$ele[0].onmousedown = $.proxy(function (event) {
                console.log(event.clientX)
                status = 1;//dragging
                origin[0] = event.clientX;
                origin[1] = event.clientY;
                if (status == 1)
                    this.$ele[0].style.cursor = 'move';
            }, this);


            this.$ele[0].onmouseup = $.proxy(function (event) {
                status = 0;//stop dragging
                originTX = offset[0];
                originTY = offset[1];
                this.$ele[0].style.cursor = 'default';
            }, this);

            this.$ele[0].onmousemove = $.proxy(function (event) {

                if (status == 1) {
                    offset[0] = event.clientX - origin[0] + originTX;
                    offset[1] = event.clientY - origin[1] + originTY;
                    console.log(origin[0], offset[1])
                    this.$heatMapLayer[0].style.transform = this.$svgLayer[0].style.transform = 'scale(' + lastFactor + ') translate(' + offset[0] + 'px,' + offset[1] + 'px)';
                }

            }, this);
        }
    }

    IndoorHeatMap.prototype.destroy = function () {
        this.$ele[0].onmousedown = null;
        this.$ele[0].onmouseup = null;
        this.$ele[0].onmousewheel = null;
        this.$ele.remove();
    }

    //插件默认参数
    var DEFAULT = {
        backgroundColor: 'transparent',//画布背景颜色
        fit: true,//是否适应画布
        disabled: false
    }
    $.fn.indoorHeatMap = function (option) {
        //合并参数,增加或覆盖默认的参数
        //当option是对象的时候才进行合并
        var options = $.extend({}, DEFAULT, typeof option === 'object' && option);
        console.log(options);
        return this.each(function () {
            console.log(this);
            var $this = $(this);
            var instance = $this.data('indoorheatmap');//缓存，查看实例是否存在
            console.log(instance)
            //确保插件不被初始化两次；
            if (!instance) {
                instance = new IndoorHeatMap($this, options);
                $this.data('indoorheatmap', instance);
            }
            if (typeof option == 'string')
                instance[option](); //存在，即调用实例的方法如destory

        });
    }
})(jQuery)//

```
