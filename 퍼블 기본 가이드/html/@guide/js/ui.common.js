"use strict";

// ie closest Polyfill
if(!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
if(!Element.prototype.closest){
	Element.prototype.closest = function(s) {
		var el = this;
		do {
			if (Element.prototype.matches.call(el, s)) return el;
			el = el.parentElement || el.parentNode;
		}while (el !== null && el.nodeType === 1);
		return null;
	};
}

// ui-accordion
const accordion = document.querySelectorAll(".ui-accordion");
[].forEach.call(accordion, function(e){
	var $this = e,
		$btn = $this.querySelectorAll(".btn-toggle"),
		$cont = $this.querySelectorAll(".toggle-target");

	function btnClickEvt(i){
		$btn[i].addEventListener("click", function(el){
			if(el.currentTarget.classList.contains("active")){
				el.currentTarget.classList.remove("active");
				el.currentTarget.setAttribute("aria-expanded","false");
				$cont[i].classList.remove("active");
			}else{
				el.currentTarget.classList.add("active");
				el.currentTarget.setAttribute("aria-expanded","true");
				$cont[i].classList.add("active");
			}
		});
	}
	for(var i = 0; i < $btn.length; i++) btnClickEvt(i)
});

// ui-confirm
const confirm = document.querySelectorAll(".btn-confirm-open");
[].forEach.call(confirm, function(e,index){
	e.addEventListener("click", function(){
		var $layer = document.querySelectorAll(".ui-confirm:not(.auto)");

		if($layer.length == 1) $layer[0].classList.add('active');
		else $layer[index].classList.add('active');
		bodyScroll.open();
		focusAccessibility(e); //접근성
	})
});
function confirmClose(e){
	e.closest(".ui-confirm").classList.remove("active");
	focusAccessibilityClose(e); //접근성
	bodyScroll.close();
}

// text field
const inp = document.querySelectorAll(".input-wrap");
[].forEach.call(inp, function(e){
	var $delete = e.querySelector(".btn-del"),
		$inp = e.querySelectorAll(".ui-input");

	for(var i = 0; i < $inp.length; i++){
		$inp[i].onfocus = function(){
			if(this.closest(".input-wrap").parentNode.querySelector('.inp-label')) this.closest(".input-wrap").parentNode.querySelector('.inp-label').classList.add("on")
		}

		$inp[i].onblur = function(){
			if(this.closest(".input-wrap").parentNode.querySelector('.inp-label')) this.closest(".input-wrap").parentNode.querySelector('.inp-label').classList.remove("on")
		}
	}

	if($delete){
		$delete.addEventListener("click", function(){
			this.closest('.input-wrap').querySelector(".ui-input").value = "";
			this.closest('.input-wrap').querySelector(".ui-input").focus();
		})

		$delete.addEventListener("mousedown", deleteFocus);
		$delete.addEventListener("focus", deleteFocus);
	}
	function deleteFocus(){
		if(e.previousElementSibling && e.previousElementSibling.classList.contains("inp-label")){
			setTimeout(function(){
				$delete.parentNode.previousElementSibling.classList.add("on");
			},0)
		}
	}
});

// selectbox
const selectOpen = document.querySelectorAll(".btn-select-open");
[].forEach.call(selectOpen, function(e){
	var $this = e,
		$layer = $this.parentNode;

	$this.addEventListener("click", function(){
		$layer.classList.add("active");
		focusAccessibility(e); //접근성
	});

	var $btn = $layer.querySelectorAll(".select-list button");
	for(var i = 0; i < $btn.length; i++){
		$btn[i].addEventListener("click", function(el){
			if(this.closest('.select-list').parentNode.classList.contains('select-wrap')){
				if(this.closest(".select-list").querySelector(".active")) this.closest(".select-list").querySelector(".active").classList.remove("active");
				el.currentTarget.classList.add("active");
				$this.innerText = this.innerText;
				$this.classList.add("has-value");
			}
		});
	}
});
function selectClose(e){
	e.closest(".ui-selectbox").classList.remove("active");
	focusAccessibilityClose(e); //접근성
}

// tab
const tabMenu = document.querySelectorAll(".ui-tab");
[].forEach.call(tabMenu , function(e){
	var $nav = e.firstElementChild,
		$li = $nav.querySelectorAll("[role='tab']"),
		$cont = [],
		$only = false;

	for(var i = 0; i < e.childNodes.length; i++) {
		if(e.childNodes[i].nodeType === 1 && e.childNodes[i].className.indexOf("tab-contents") !== -1) $cont.push(e.childNodes[i]);
	}
	if($cont.length<=1) $only = true;
	$cont[0].tabIndex = "0";

	for(var j = 0; j < $li.length; j++){
		$li[j].addEventListener("click", function(el){
			for(var k = 0; k < $li.length; k++){
				$li[k].classList.remove("active");
				$li[k].setAttribute("aria-selected","false");
				if(!$only){
					$cont[k].classList.remove("active");
					$cont[k].tabIndex = "-1";
				}
			}

			el.currentTarget.classList.add("active");
			el.currentTarget.setAttribute("aria-selected","true");
			if(!$only){
				$cont[getElementIndex(el.target.parentNode)].classList.add("active");
				$cont[getElementIndex(el.target.parentNode)].tabIndex = "0";
			}else{
				$cont[0].setAttribute("aria-labelledby", el.currentTarget.getAttribute("id"));
				$cont[0].setAttribute("id", el.currentTarget.getAttribute("aria-controls"));
			}
		});
	}
})

// tooltip
const tooltip = document.querySelectorAll(".ui-tooltip");
[].forEach.call(tooltip, function(e){
	var $open = e.querySelector(".btn-tooltip-open");

	$open.addEventListener("click", function(){
		if(e.classList.contains("active")){
			e.classList.remove("active");
		}else{
			for(var i = 0; i < tooltip.length; i++) tooltip[i].classList.remove("active");
			e.classList.add("active");
		}
	});
});

body.addEventListener("click", clickBodyTooltip);
function clickBodyTooltip(e){
	var _target = e.target;
	var $open = document.querySelectorAll(".btn-tooltip-open");

	for(var i = 0; i < $open.length; i++){
		if($open[i] == _target) return;

		var tags = $open[i].parentNode.getElementsByTagName("*");
		for(var j=0; j < tags.length; j++) if(tags[j] == _target ) return;
	}
	for(var i = 0; i < tooltip.length; i++) tooltip[i].classList.remove("active");
}

// font resize
var defaultFont = 10;
if(document.querySelector("#fontResize")){
	document.querySelector("#fontResize").addEventListener("click", function(){
		this.checked == true ? defaultFont = 12 : defaultFont = 10
		body.style.fontSize = defaultFont+"px"
		document.querySelector("html").style.fontSize = defaultFont+"px"
	})
}
