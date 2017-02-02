 (function($){
    $.fn.waterFall = function(){
        //$(this)是瀑布流容器
        var $this = $(this);
        //得到容器的宽度
        var parentWidth = $this.width();
        // console.log(parentWidth);//1200
        // 得到容器中的item
        var items = $this.children();
        // 子容器的宽度
        var childWidth = items.width();
        // console.log(childWidth);//232
        // 列数
        var columnCount = 5;
        // 间距
        var space = (parentWidth - childWidth*columnCount)/(columnCount -1);
        /*核心布局代码*/
         /*
        * 1.第一排的盒子 top定位  都是0
        * 2.距离左边的距离  根据当前所属的列  第几列 5  索引 4*宽度+间距
        * 3.计算top的定位  找到最矮的那列  把它追加上去
        * 4.容器是没有高度的  需要计算最高的那列 设置高度
        * 【怎么样实时的记录每一列的高度】 需要有一个记录每一列高度的变量  数组记列五裂的高度
        * */
        var colArray = [];
        /*遍历所有的盒子*/
        $.each(items,function(i, item){
            // 当前的盒子
            var $item = $(item);
            /*索引是0-4就是五个第一排的盒子*/
            if(i < 5){
                /*初始化数组*/
                colArray[i] = $item.height();
                // 第一排盒子定位
                $item.css({
                    top:0,
                    left:i*(childWidth + space)
                });
            }else{
                /*计算定位*/
                /*3.计算top的定位,找到最矮的那列，把它追加上去*/
                var minItem = colArray[0];//最小的高度
                var minIndex = 0;//最小的索引
                for(var j = 0; j< colArray.length; j++){
                    if(minItem >colArray[j]){
                        minItem = colArray[j];
                        minIndex = j;
                    }
                }
                // 定位
                $item.css({
                    top:minItem + space,
                    left:minIndex*(childWidth + space)
                })
                // 高度变了需要重新设置
                colArray[minIndex] = minItem + space + $item.height();


            }

        });
        /*布局完成再来设置容器的高度*/
        /*4.容器是没有高度的，需要计算最高的那列设置高度*/
        var maxItem = colArray[0];
        for(var i =0; i<colArray.length;i++){
            if(maxItem<colArray[i]){
                maxItem = colArray[i];
            }
        }
        $this.height(maxItem);

    }
 })(jQuery)

