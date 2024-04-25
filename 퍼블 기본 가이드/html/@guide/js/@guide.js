'use strict';

function getInternetExplorerVersion(){
	var rv = -1;
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
	}
	return rv;
}
var ver = getInternetExplorerVersion();
if (ver > -1) if(ver < 10) alert("해당 브라우저 버전은 지원하지 않습니다.  \n브라우저를 업그레이드하거나 크롬으로 확인바랍니다. \n \nIE는 10이상부터 지원. 크롬 최적화");


var nodeSel = document.querySelectorAll('[id*="imenu"] + a');
function nodeSelRemove(){
	[].forEach.call(nodeSel, function(el){
		el.className = "node";
	});
}
nodeSelRemove();

function move(elem){
	var width = 0;
	function frame(){
		width++;
		elem.style.width = width + '%';
		var origWid = elem.getAttribute('data-width');
		if (width == origWid) clearInterval(id);
	}
	var id = setInterval(frame, 15);
}

var _tree = document.querySelector('.tree');
if(_tree){
	nodeSel[1].className="node nodeSel";
	[].forEach.call(_tree.querySelectorAll('.node'),function(e){
		e.addEventListener('click', function(){
			nodeSelRemove();
			this.className= "node nodeSel";

			if(this.target=='mainFrame'){
				document.querySelector('#mainFrame').className=""
				document.querySelector('#guideFrame').className="hide"
				document.querySelector('#mobileFrame').className="hide"
			}else if(this.target=='guideFrame'){
				document.querySelector('#guideFrame').className=""
				document.querySelector('#mobileFrame').className="hide"
				document.querySelector('#mainFrame').className="hide"
			}else if(this.target=='mobileFrame'){
				document.querySelector('#mobileFrame').className=""
				document.querySelector('#mainFrame').className="hide"
				document.querySelector('#guideFrame').className="hide"
			}
		})
	});

	if(document.querySelector('.left')){
		var toggle = document.createElement('button');
		toggle.className = "menu-toggle";

		document.querySelector('.left').appendChild(toggle);
		var container = document.querySelector('.container');

		var clicked = 0;
		toggle.addEventListener('click', function(){
			if(clicked){
				this.className = "menu-toggle";
				container.className = "container";
				clicked = 0;
			}else{
				this.className = "menu-toggle active";
				container.className = "container close";
				clicked = 1;
			}
		});
	}

	var progress = document.querySelector('.progress');
	if(progress){
		var listNode = _tree.querySelectorAll('[id*="dmenuIA"] [target="mainFrame"]');
		var removeNode = _tree.querySelectorAll('[id*="dmenuIA"] [target="mainFrame"][data-state="삭제"]');
		var finish = _tree.querySelectorAll('[id*="dmenuIA"] [data-state="완료"]');
		var stateBar = progress.querySelector('.ing');
		var barWidth = parseInt((finish.length / (listNode.length - removeNode.length)) * 100);

		if(finish.length >= !0){
			stateBar.setAttribute('value',finish.length);
			stateBar.setAttribute('max',listNode.length);
			stateBar.setAttribute('data-width', barWidth);
			move(stateBar)
		}

		var count = document.createElement('div');
		progress.appendChild(count);
		count.className = "count";
		count.innerHTML = finish.length + ' / ' + (listNode.length - removeNode.length);
	}

	var treeCtrl = document.querySelector('.tree-ctrl');
	if(treeCtrl){
		var btn = treeCtrl.querySelectorAll('button');

		var state,
			guide = menuGuide.className,
			ia = menuIA.className;

		if(guide == 'active'){
			if(ia == "") state = treeCtrl.querySelector('[data-name="guide"]');
			if(ia == "active") state = treeCtrl.querySelector('[data-name="open"]');
		}else if(ia== "active"){
			if(guide == "") state = treeCtrl.querySelector('[data-name="ia"]');
			if(guide == "active") state = treeCtrl.querySelector('[data-name="open"]');
		}else{
			state = treeCtrl.querySelector('[data-name="close"]');
		}
		state.className = 'active';

		[].forEach.call(btn, function(e){
			e.addEventListener('click', function(){
				[].forEach.call(btn, function(el){el.className = ''});
				this.className = 'active';

				var name = this.getAttribute('data-name');
				switch(name){
					case 'open' :
						menuIA.openAll();
						menuGuide.openAll();
						break;
					case 'close' :
							menuIA.closeAll();
							menuGuide.closeAll();
						break;
					case 'ia' :
							menuIA.openAll();
							menuGuide.closeAll();
						break;
					case 'guide' :
							menuIA.closeAll();
							menuGuide.openAll();
						break;
				}
			});
		})
	}
};

var _sourceView = document.querySelectorAll('.source-view');
function includeJS(jsFilePath){
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.src = jsFilePath;
	document.head.appendChild(js);
}
if(_sourceView.length>0){
	includeJS('./js/@pretty.js');
	[].forEach.call(_sourceView, function(e){
		var source = e.innerHTML;

		e.insertAdjacentHTML('afterend','<div class="source-code"></div>');
		var codeWrap = e.nextElementSibling;

		var xmp = document.createElement('xmp');
		xmp.className = "prettyprint linenums";
		xmp.innerHTML = source;

		var text = '';
		if(e.previousElementSibling.classList.contains('example')) e = e.previousElementSibling;
		if(e.previousElementSibling.classList.contains('tit-guide')){
			if(e.previousElementSibling.tagName == 'h3' || e.previousElementSibling.tagName == 'H3') var type = ' ';
			else var type= ' 타입 ';
			text = e.previousElementSibling.innerHTML + type;
		}

		var btn = document.createElement('button');
		btn.className = 'btn-code';
		btn.innerText = text + '소스코드 열기';
		btn.addEventListener('click', function(){
			var bTxt = this.innerText;
			if(codeWrap.classList.contains('open')){
				this.innerText = bTxt.replace(/닫기/gi, '열기');
				codeWrap.classList.remove('open');
			}else{
				this.innerText = bTxt.replace(/열기/gi, '닫기');
				codeWrap.classList.add('open');
			}
		})
		codeWrap.appendChild(btn);

		var copy = document.createElement('button');
		copy.className = "btn-copy";
		copy.innerText = '코드 복사';
		copy.addEventListener('click', function(){
			var copyVal = document.createElement('textarea');
			codeWrap.appendChild(copyVal);
			copyVal.value = source;
			copyVal.select();
			document.execCommand('copy');
			codeWrap.removeChild(copyVal);
			alert('복사 완료!');
		});
		codeWrap.appendChild(copy);
		codeWrap.appendChild(xmp);
	})
}