//调用插件
$(function() {

	var $one = $("#one").tinyAccordion({
		"width": 680,
		"height": 300,
		"easing": "easeOutBounce",
		"activateOn": "mouseover",
		"autoPlay": true,
		"speed": 1000,
		"playInterval": 2000,
		"showInBar": true
	});

	var $two = $("#two").tinyAccordion({
		"width": 680,
		"height": 250,
		"barWidth": 40,
		"speed": 1000,
		"initialActiveItem": 2
	});



	var $three = $("#three").tinyAccordion({
		"width":760,
		"height": 240,
		"barWidth": 60,
		"easing": "swing",
		"onTriggerAnimate": onTrigger,
		"onAnimateComplete": onComplete
	});

	var $four = $("#four").tinyAccordion({
		"width": 740,
		"height": 240,
		"easing": "easeOutBounce",
		"initialActiveItem": 2,
		"activateOn": "mouseover"
	});


	$("li>div", $three).not(":first").hide();
	function onTrigger() {
		$(">div", this.itemToShow).fadeIn(1500);
		$(">div", this.itemToHide).hide(500);
		$(".info", this.itemToHide).animate({"top": -50}, 500);
	}

	function onComplete() {
		$(".info", this.itemToShow).animate({"top": 200}, 500);
	}



	$("#prev").click(function() {
		$four.prev();
	});

	$("#next").click(function() {
		$four.next();
	});

	$("#start").click(function() {
		$four.start();
	});

	$("#stop").click(function() {
		$four.stop();
	});


});