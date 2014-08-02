/*******************************************************************
Jquery手风琴效果插件
版本：1.0
作者：wangyuan
====================================================================






使用说明：

--------------------------------------------------------------------
调用方法：
$("#accordion-wrap").tinyAccordion({...});

将手风琴的容器div获取为一个jQUery对象，然后调用tinyAccordion()函数即可，
通常需要向tinyAccordion函数传递一个对象作为参数。（请参考后面参数说明）



--------------------------------------------------------------------
html结构要求如下：
<div id="accordion-wrap">
  <ul>
	<li>
	  <h2></h2>
	  <div></div>
	</li>
	<li>
	  <h2></h2>
	  <div></div>
	</li>

	......
	......
  </ul>
</div>

解释：最外层div是手风琴的整体，对其id和class没有要求，方
便获取就好了。里面是一个ul，li就是各个子项，你可以按自己
需求放置制任意项数，子项里面的h2为左边的控制条，后面的div
为内容块，可以自己安排放置你想放的任意内容




--------------------------------------------------------------------
CSS要求：
CSS没有要求，当然你也可以自己定义样式，特别是定义内容div




--------------------------------------------------------------------
调用参数说明：
可以传入一个对象作为参数，其属性可以有如下几种：

"width": 800,           //整体宽度
"height": 400,            //整体高度
"barWidth": 30,           //点击条(h2)宽度

"showInBar": false,		//控制条是否也显示内容区左边部分内容

"initialActiveItem": 0,       //初始时显示项(编号是从零计数的)
"activateOn": "click",        //滑动的触发方式

"speed": 500,           //滑动速度（时间，越小越快）
"easing": "swing",          //滑动的效果

"onTriggerAnimate": function() {},  //滑动开始时调用的函数
"onAnimateComplete": function() {}, //滑动结束时调用的函数


"autoPlay": false,          //是否自动播放
"pauseOnHover": true,       //鼠标hover的时候是否暂停
"playInterval": 800         //自动播放的时间间隔


上面各个参数冒号后面的值是默认值，可以不设参数对象的某个属性，
不设的话将使用默认值!




--------------------------------------------------------------------
提供的接口方法：
为了方便插件使用者通过其他代码来控制手风琴，如通过点击某个按钮停止
/启动循环播放、播放下一项/上一项，可以在手风琴对象上调用如下方法：
start();      //启动播放
stop();       //停止播放
next();     //播放到下一项
prev();     //播放到前一项
activeItem(number); //播放到指定项(编号是从零计数的)

调用方式类似于下面的例子：
var $accordion = $("#accordion-wrap").tinyAccordion({...});
$("#button").click(function() {
  $accordion.next();
});




--------------------------------------------------------------------
其他说明：

1、滑动的触发方式，默认是click，可以设置为mouseover。

2、滑动效果：由于jquery默认可用的只有linear和swing，如果你想实现
其他效果，请下载其他easing，如jqueryUI里面有提供。

3、两个回调函数的执行环境(即里面的this指向)被设为包裹手风琴整体的
div，这样就可以方便的控制手风琴了。

4、如果希望取得itemToShow(即将显示出来的项)或itemToHide(原来显示，
但即将被遮挡的项)，可以在手风琴上以属性的方式来访问。比如在上面说
的两个回调中，通过this.itemToSow、this.itemToHide就可以访问了。
(注意：它们是纯粹的DOM对象，不是jQuery实例对象)

********************************************************************/


(function($) {

	$.fn.extend({
		"tinyAccordion": function(options) {

			/*======设置默认参数======*/
			options = $.extend({
				"width": 800,
				"height": 400,
				"barWidth": 30,

				"showInBar": false,

				"initialActiveItem": 0,
				"activateOn": "click",

				"speed": 500,
				"easing": "swing",

				"onTriggerAnimate": function() {},
				"onAnimateComplete": function() {},


				"autoPlay": false,
				"pauseOnHover": true,
				"playInterval": 800

			}, options);


			/*======缓存一些变量======*/
			//所有项的集合
			var $allItems = $(">ul>li", this);
			//子项的个数
			var iNum = $allItems.length;

			//所有点击条的集合
			var $allBar = $(">h2", $allItems);
			//所有的内容区的集合
			var $allContent = $(">div", $allItems);

			//需要移动的项
			var $itemsToMove = null;

			//要移动到的目标点位置
			var to = 0;
			//此时播放到的项
			var iNow = options.initialActiveItem;


			//手风琴div，保存this环境引用
			var _this = this;

			//定时器
			var timer = null;

			//即将显示项
			_this.itemToShow = $allItems[options.initialActiveItem];
			//原来显示但即将被遮挡项
			_this.itemToHide = $allItems[options.initialActiveItem];


			/*======初始化======*/
			/*----布局----*/
			//整体宽高及定位
			this.css({
				"width": options.width,
				"height": options.height,
				"position": "relative",
				"overflow": "hidden"
			});

			//各项宽高(宽高与总体的一样)
			$allItems.css({
				"width": options.width,
				"height": options.height,
				"position": "absolute",
				"list-style": "none"
			}).
			//初始化各项的位置
			each(function(index) {
				var left = 0;

				//需要靠右的项
				if (index > options.initialActiveItem) {
					//计算除第一项以外其他项的位置
					left = options.width - (iNum - index) * options.barWidth;
					//设置状态（左还是右）标志位
					this.lor = 1;
				}
				//初始化需要靠左的项
				else {
					left = index * options.barWidth;
					this.lor = 0;
				}
				$(this).css({
					"left": left
				});
			});

			//点击条宽高
			$allBar.css({
				"position": "absolute",
				"width": options.barWidth,
				"height": options.height,
				"display": "block",
				"cursor": options.activateOn === "click" ? "pointer" : "normal",
				"z-index": 100
			})
			//触发滑动的方式：点击或鼠标hover
			[options.activateOn](doAnimate);

			//内容区
			$allContent.css({
				"width": options.width - options.barWidth * iNum,
				"height": options.height,
				"position": "absolute",
				"top": 0,
				"left": options.showInBar ? 0 : options.barWidth
			});

			//启动自动播放
			if (options.autoPlay) {
				start();
			}

			//鼠标悬停时暂停播放
			if (options.autoPlay && options.pauseOnHover) {
				this.mouseover(function() {
					stop();
				});
				this.mouseout(function() {
					start();
				});
			}


			/*-----向外提供可以调用的方法-----*/
			_this.next = next;
			_this.prev = prev;

			_this.start = start;
			_this.stop = stop;

			_this.activeItem = activeItem;


			/*========接下来是各个函数定义========*/

			/*启动循环播放*/

			function start() {
				clearInterval(timer);
				timer = setInterval(next, options.playInterval);
			}

			/*停止循环播放*/

			function stop() {
				clearInterval(timer);
			}

			/*显示下一个*/

			function next() {
				iNow++;
				if (iNow === iNum) {
					iNow = 0;
				}
				activeItem(iNow);
			}

			/*显示前一个*/

			function prev() {
				iNow--;
				if (iNow < 0) {
					iNow = iNum - 1;
				}
				activeItem(iNow);
			}

			/*功能函数：显示指定序号项*/

			function activeItem(orderNumber) {
				var bar = $("h2", $allItems[orderNumber])[0];
				doAnimate.call(bar);
			}


			/*=======滑动（核心函数）======*/

			function doAnimate() {

				/*-----注意，这里面this指向被点击(或hover)的项的点击条，即h2-----*/

				//当前被点击(或鼠标hover)的项
				var $item = $(this).parent();

				//即将被遮挡项就是上次的itemToShow

				_this.itemToHide = _this.itemToShow;

				//如果被点击(或鼠标hover)项靠右边
				if ($item[0].lor) {

					//即将显示的项
					_this.itemToShow = $item[0];

					//滑动开始时调用给定的函数
					options.onTriggerAnimate.call(_this);

					//刷选出靠右边且处在当前被点击（或鼠标hover）项左边的
					$itemsToMove = $item.prevAll().filter(function() {
						//直接通过标志位判断
						return this.lor;
					}).add($item);

					//滑动
					$itemsToMove.each(function() {
						//获得移动到的位置
						to = $(this).prevAll().length * options.barWidth;
						//改变位置标志位
						this.lor = !this.lor;

						$(this).stop().animate({
							"left": to
						}, options.speed, options.easing, function() {
							//滑动完成后调用给定的函数（只调用一次，所以做判断）
							if (this === _this.itemToShow) {
								options.onAnimateComplete.call(_this);
							}
						});

					});
				}

				//如果被点击(或鼠标hover)项靠左边
				//包括两种情况，一种是被点击项此时已经显示，一种是还被遮挡着即将显示
				else {

					_this.itemToShow = $item[0];

					//刷选出靠左边且处在当前点击(或鼠标hover)项的右边的
					$itemsToMove = $item.nextAll().filter(function() {
						return !this.lor;
					});

					//如果被点击(或鼠标hover)的就是当前正在显示的项，那么要移动的就是它自己(要排除掉第一项)
					if ($itemsToMove.length === 0 && $allItems.index($item) !== 0) {
						$itemsToMove = $item;

						//即将显示的是其前面的兄弟
						_this.itemToShow = $item.prev()[0];
					}

					//第一项
					else if($itemsToMove.length === 0 && $allItems.index($item) === 0) {

						_this.itemToShow = _this.itemToHide = {};
					}

					//滑动开始时调用给定的函数
					options.onTriggerAnimate.call(_this);

					//滑动
					$itemsToMove.each(function() {
						//获得移动到的位置
						to = options.width - ($(this).nextAll().length + 1) * options.barWidth;
						this.lor = !this.lor;
						$(this).stop().animate({
							"left": to
						}, options.speed, options.easing, function() {
							if (this === $(_this.itemToShow).next()[0]) {
								options.onAnimateComplete.call(_this);
							}
						});

					});
				} /*end else*/

				//同步更新
				iNow = $allItems.index(_this.itemToShow) ;
				if (iNow < 0) {iNow = 0;}	//fix a bug


			} /*end function doAnimate*/

			// 返回this,以便链式调用
			return this;
		}

	});
})(jQuery);
