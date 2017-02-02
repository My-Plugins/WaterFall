### 瀑布流插件介绍
这是一个基于jQuery的插件,并且结合ajax实现异步的加载瀑布流。
### 瀑布流布局实现
1.引入css文件
```js
<link rel="stylesheet" href="css/style.css">
```
2.引入jquery包、watefall包
```js
<script src="js/jquery.min.js"></script>
<script src="js/template.js"></script>
<script src="js/my-jquery.waterfall.js"></script>
```
3.html代码
```js
<div class="container">
    <div class="items">
      <!-- TODO 需要渲染数据的地方 -->
    </div>
    <div class="btn">加载更多...</div>
</div>
```
4.模板
```js
<script type="text/template" id="tpl">
  {{each items as value i}}
      <div class="item">
        <img src="{{value.path}}" alt="{{i}}">
        <p>{{value.text}}</p>
      </div>
  {{/each}}
</script>
```
5.js代码
```js
  /*
    1.请求方式  get
    2.请求url  data.php
    3.请求传递的参数   page  当前页数  pageSize  每一页多少条数据
    4.是后台在处理
    5.返回数据 {page:'下一页的页码',items:[{path:'图片路径',text:'文字'},{},{}...]}
  */
 $(function(){
      // 获取瀑布流容器
      var $container = $('.items');
      var $btn = $('.btn');
      var renderHtml = function(){
        $.ajax({
            type:'get',
            url:'data.php',
            data:{
              page:$btn.data('page') || 1,//去页面，如果没有默认的是第一页
              pageSize:10//每一页的条数
            },
            dataType:'json',
            beforeSend:function(){
              $btn.addClass('loading').html('正在加载中.....');
            },
            success:function(data){
              //处理数据
              //设置下一页的页码
              $btn.data('page',data.page);
              //渲染页面
              // 1.写模板
              // 2.转化成html结构
              var html = template('tpl',data);
              // 3.页面渲染
              $container.append(html);
              // 4.瀑布流布局
              $container.waterFall();

              if(data && data.items && data.items.length){
                $btn.removeClass('loading').html('加载更多');
              }else{
                $btn.addClass('loading').html('没有更多数据了');
              }

            }
        })
      }
      /** 3.当我们点击加载更多的时候  去请求接口获取数据  把数据渲染成html （下一页）
         * 4.防止重复提交*/
      $btn.on('click',function(){
          if($btn.hasClass('loading')){
            return false;
          }
          renderHtml();
      })
    })
```
6.php代码
```js
<?php
    header('Content-Type:text/html,charset=utf-8');

// 获取数据字符串
$data = file_get_contents('data.json');
// 转换为php对象
$data = json_decode($data);
//页码
$page=$_GET['page'];
//条数
$pageSize = $_GET['pageSize'];
//获得数据的起始索引
$offset = ($page - 1)* $pageSize;
  /*array_slice 从什么位子开始切割 切割多少条*/
$result = array_slice($data,$offset,$pageSize);
// 下一页的页码
$page++;
echo json_encode(array('page'=>$page,'items'=>$result));
sleep(1);
?>
```

