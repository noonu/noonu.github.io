$(function() {

	//初始化手风琴
	var $accordion= $("#accordion-wrap").tinyAccordion({
		"width": 980,
		"height": 500,
		"barWidth": 50,
		"easing": "easeInQuad",
		"onTriggerAnimate": function() {
			$(".content", this.itemToHide).slideUp(500);
		},
		"onAnimateComplete": function() {
			$(".content", this.itemToShow).slideDown(800);
		}
	}).find("li>div").not(":first").css("display","none");

	//欢迎界面
	setTimeout((function() {
		$('#welcome').slideUp(function() {
			$('#wrapper').css("display", "block").find("#accordion-wrap").animate({"top": 30}, 800, "easeOutBounce", function() {
				$('.works-list').jScrollPane();
			});
		});
	}), 500);
});