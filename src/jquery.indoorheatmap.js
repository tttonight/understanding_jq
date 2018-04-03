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
            var instance = $this.data('indoorheatmap');
            console.log(instance)
            if (!instance) {
                instance = new IndoorHeatMap($this, options);
                $this.data('indoorheatmap', instance);
            }
            if (typeof option == 'string')
                instance[option]();

        });
    }
})(jQuery)//


$('#main2').indoorHeatMap({
    backgroundColor: 'blue',
    svgUrl: '0062.svg',
    data: [{ x: 70, y: 65, value: 5 }, { x: 170, y: 165, value: 2 }]
});
// $('#main2').indoorHeatMap('hide');
