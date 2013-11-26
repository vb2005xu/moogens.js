//common global property
var __doc = document,__undef = 'undefined',__proto = "prototype";

//common global func
function $C(tagName) { return __doc.createElement(tagName)}
function $TagN(name) { return __doc.getElementsByTagName(name)}
function $N(name) {	return __doc.getElementsByName(name)}
function $ID(id) { return __doc.getElementById(id)}
function $Get(s,c) { return Moogens.Dom.get(s,c)}

function loadjs(src){
	var s = $C('script');
	s.type = 'text/javascript';
	s.src = src;
	$TagN('head')[0].appendChild(s);
}
function loadcss(href){
	var l = $C('link');
	l.rel = 'stylesheet';
	l.type = 'text/css';
	l.href = href;
	$TagN('head')[0].appendChild(s);
}
function $clsN(node,classname) {
	var re = new RegExp('(^| )' + classname + '( |$)');
	return Moogens.Utilities.arrayMap(node.getElementsByTagName('*'),function(el,i){
		if (el && el.nodeType==1 && re.test(el.className) )
			return el;
		return null; 
	});
}
function $tagByAttribute(tag,attr,value){
	return Moogens.Utilities.arrayMap($TagN(tag||'*'),function(el,i){
		return el.getAttribute(attr) == value ? el : null; 
	});
}

(function(){
if (typeof Moogens == __undef) {
	Moogens = {meta: {author: 'kenxu',version: '0.01'}};
}
if (typeof console == __undef) {
	console = {log: function(){}} ;
}
if (typeof Object.create !== 'function') {
	Object.create = function (o) {
		function F(){}
		F[__proto] = o;
		return new F();
	}
}
Object.extend = function(dest, source) {
	for (var property in source) dest[property] = source[property];
	return dest;
};
Object.extend(String[__proto],{
	trim: function(){return this.replace(/^\s+|\s+$/g, '');} ,
	// zIndex 变成 z-index	
	nocamelize: function(split){return this.replace(/(?=[A-Z])/g, split || '-').toLowerCase();} ,
	// z-index 变成 zIndex
	camelize: function(){return this.replace(/-([a-z])/g, function(_0,_1){return _1.toUpperCase();});},
	// @{id} 变成 值
	tpl: function(k,v){return this.replace(new RegExp("@{" + k + "}", "g"),v);},
	toJson: function(){
		if ( /^[\],:{}\s]*$/.test(this.trim().replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			return window.JSON && window.JSON.parse ?
				window.JSON.parse( this.trim() ) :
				(new Function("return " + this.trim()))();

		} else {
			alert( "Invalid JSON: " + this.trim() );
		}
		return null ;
	}
});

Function[__proto].bind = function(object) {
	var __method = this;
	return function() {
		return __method.apply(object, arguments);
	}
};

Moogens.Class = {
	create: function() {
		return function() {
			this.initialize.apply(this, arguments);
		}
	}
};

Moogens.Utilities = {
	arrayMap: function(list, fn) {
		if (list && list.length){
			var r = [];
			for (var i = 0; i < list.length; i++) {
				var x = fn(list[i], i);
				if (x !== null) {
					r.push(x) ;
				}
			}
			return r ;
		}
		return [];
	} ,
	each: function(list,fn){
		if (list && list.length)
			for (var i = 0; i < list.length; i++)
				if (fn.call(list[i],i) == '#end#') break ;
	},
	toArray: function(list){
		if (typeof list == __undef) return [] ;
		
		if (Object[__proto].toString.call(list) === '[object Array]')
			return list ;
			
		var nArray = [];
	
		if (typeof list.length != __undef){
			for (var i = 0; i < list.length; i++) nArray.push(list[i]);
		}
		else {
			nArray.push(list);
		}		
		return nArray ;		
	}
};

Moogens.Browser = new function(){
	// Useragent RegExp		
//	var notIE = -[1,];
//	var ie = !+"\v1"; //在ie下 +"\v1" 是NaN，而在其他浏览器下是1
	
	var re = {
		webkit: /(webkit)[ \/]([\w.]+)/ ,
		opera: /(opera)(?:.*version)?[ \/]([\w.]+)/ ,
		msie: /(msie) ([\w.]+)/ ,
		mozilla: /(mozilla)(?:.*? rv:([\w.]+))?/
	} ;
	this.userAgent = navigator.userAgent ;
	this.uaMatch = function( ua ) {
		ua = ua.toLowerCase();

		var match = re.webkit.exec( ua ) ||
			re.opera.exec( ua ) ||
			re.msie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && re.mozilla.exec( ua ) || [];
		
		return { browser: match[1] || "", version: match[2] || "0" };
	} ;
	
	var match = this.uaMatch(this.userAgent);
	
	this[match.browser] = true ;
	this.version = match.version ;
	this.lang = (navigator.language || navigator.browserLanguage).toLowerCase();
	
	if (this.webkit) this.safari = true;
	this.mobile = /(iPhone|iPad|iPod|Android)/i.test( this.userAgent );
	re = null ;
};

Moogens.Cookie = new function(){		
	this.get = function (name) {
		var arr = __doc.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) {
			return decodeURIComponent(arr[2]);
		}
		return null;
	};
	this.set = function (sName,sValue,objHours,sPath,sDomain,bSecure){
		var sCookie = sName + "=" + encodeURIComponent(sValue);
		if (objHours) {
			var date = new Date();
			var ms = objHours * 3600 * 1000;
			date.setTime(date.getTime() + ms);
			sCookie += ";expires=" + date.toGMTString();
		}
		if (sPath) {
			sCookie += ";path=" + sPath;
		}
		if (sDomain) {
			sCookie += ";domain=" + sDomain;
		}
		if (bSecure) {
			sCookie += ";secure";
		}
		__doc.cookie=sCookie;
	};		
	this.clear = function (sName,sPath,sDomain,bSecure){
		this.set(sName,'',0,sPath,sDomain,bSecure);
	} ;
};

Moogens.Dom = {
		
	/*
	 * onDOMReady
	 * Copyright (c) 2009 Ryan Morr (ryanmorr.com)
	 * Licensed under the MIT license.
	 */
	onReady: function(fn, ctx){
		var ready, timer;
		var onStateChange = function(e){
			//Mozilla & Opera
			if(e && e.type == "DOMContentLoaded"){
				fireDOMReady();
			//Legacy	
			}else if(e && e.type == "load"){
				fireDOMReady();
			//Safari & IE
			}else if(__doc.readyState){
				if((/loaded|complete/).test(__doc.readyState)){
					fireDOMReady();
				//IE, courtesy of Diego Perini (http://javascript.nwbox.com/IEContentLoaded/)
				}else if(!!__doc.documentElement.doScroll){
					try{
						ready || __doc.documentElement.doScroll('left');
					}catch(e){
						return;
					}
					fireDOMReady();
				}
			}
		};
		
		var fireDOMReady = function(){
			if(!ready){
				ready = true;
				//Call the onload function in given context or window object
				fn.call(ctx || window);
				//Clean up after the DOM is ready
				if(__doc.removeEventListener)
					__doc.removeEventListener("DOMContentLoaded", onStateChange, false);
				__doc.onreadystatechange = null;
				window.onload = null;
				clearInterval(timer);
				timer = null;
			}
		};
		
		//Mozilla & Opera
		if(__doc.addEventListener)
			__doc.addEventListener("DOMContentLoaded", onStateChange, false);
		//IE
		__doc.onreadystatechange = onStateChange;
		//Safari & IE
		timer = setInterval(onStateChange, 5);
		//Legacy
		window.onload = onStateChange;
	}

} ;

// DOM Selector
/* 
 * "mini" Selector Engine 
 * Copyright (c) 2009 James Padolsey 
 * ------------------------------------------------------- 
 * Dual licensed under the MIT and GPL licenses. 
 *    - http://www.opensource.org/licenses/mit-license.php 
 *    - http://www.gnu.org/copyleft/gpl.html 
 * ------------------------------------------------------- 
 * Version: 0.01 (BETA) 
	
	Usage:
	
	var pAnchors = mini('p > a'); // Returns an array.
	
	for (var i = 0, l = pAnchors.length; i < l; ++i) {
	    // Do stuff...
	}
	Supported Selectors:
	
	tag 
	tag > .className 
	tag > tag 
	#id > tag.className 
	.className tag 
	tag, tag, #id 
	tag#id.className 
	.className 
	span > * > b 
 */
var mini=(function(){var b=/(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,g=/^(?:[\w\-_]+)?\.([\w\-_]+)/,f=/^(?:[\w\-_]+)?#([\w\-_]+)/,j=/^([\w\*\-_]+)/,h=[null,null];function d(o,m){m=m||document;var k=/^[\w\-_#]+$/.test(o);if(!k&&m.querySelectorAll){return c(m.querySelectorAll(o))}if(o.indexOf(",")>-1){var v=o.split(/,/g),t=[],s=0,r=v.length;for(;s<r;++s){t=t.concat(d(v[s],m))}return e(t)}var p=o.match(b),n=p.pop(),l=(n.match(f)||h)[1],u=!l&&(n.match(g)||h)[1],w=!l&&(n.match(j)||h)[1],q;if(u&&!w&&m.getElementsByClassName){q=c(m.getElementsByClassName(u))}else{q=!l&&c(m.getElementsByTagName(w||"*"));if(u){q=i(q,"className",RegExp("(^|\\s)"+u+"(\\s|$)"))}if(l){var x=m.getElementById(l);return x?[x]:[]}}return p[0]&&q[0]?a(p,q):q}function c(o){try{return Array[__proto].slice.call(o)}catch(n){var l=[],m=0,k=o.length;for(;m<k;++m){l[m]=o[m]}return l}}function a(w,p,n){var q=w.pop();if(q===">"){return a(w,p,true)}var s=[],k=-1,l=(q.match(f)||h)[1],t=!l&&(q.match(g)||h)[1],v=!l&&(q.match(j)||h)[1],u=-1,m,x,o;v=v&&v.toLowerCase();while((m=p[++u])){x=m.parentNode;do{o=!v||v==="*"||v===x.nodeName.toLowerCase();o=o&&(!l||x.id===l);o=o&&(!t||RegExp("(^|\\s)"+t+"(\\s|$)").test(x.className));if(n||o){break}}while((x=x.parentNode));if(o){s[++k]=m}}return w[0]&&s[0]?a(w,s):s}var e=(function(){var k=+new Date();var l=(function(){var m=1;return function(p){var o=p.k,n=m++;if(!o){p.k=n;return true}return false}})();return function(m){var s=m.length,n=[],q=-1,o=0,p;for(;o<s;++o){p=m[o];if(l(p)){n[++q]=p}}k+=1;return n}})();function i(q,k,p){var m=-1,o,n=-1,l=[];while((o=q[++m])){if(p.test(o[k])){l[++n]=o}}return l}return d})();

Moogens.Dom.get = function(selector, context){
	return typeof selector == 'string' ? mini(selector, context) :
		typeof selector == '[object Array]' ? selector : new Array(selector);
};

Moogens.Dom.Node = function(ele){
	
	this.setElement = function(ele){this.ele = ele && ele.nodeType ? ele : null ;return this;} ;
	this.getElement = function(ele){return this.ele ;} ;
	this.getElementTag = function(){return this.ele.nodeName;} ;
	this.getElementType = function(){return this.ele.nodeType;} ;
	
	this.setElement(ele || null) ;
	
	// css class relative
	this.hasClass = function(name) {
		var re = new RegExp('(^| )' + name + '( |$)');
		return re.test(this.ele.className) ;
	};
	this.addClass = function(name) {return this.toggleClass(name,true) ;};
	this.removeClass = function(name) {return this.toggleClass(name,false) ;};	
	this.toggleClass = function (name,cond) {
		if (typeof name == __undef) this.ele.className = '' ;
		else {
			var re = new RegExp('(^| )' + name + '( |$)');			
			var had = re.test(this.ele.className) ;
			if (typeof cond != __undef){
				if (cond){
					if (!had) this.ele.className += ' ' + name;
				}else 
					if (had) this.ele.className = this.ele.className.replace(re, ' ');				
			}else
				this.ele.className = had ? this.ele.className.replace(re, ' ') : this.ele.className + ' ' + name ;
			
			re = had = null ;
		}
		return this ;
	};
	this.css = function(key,value){
		if (typeof key == 'object'){
			for(var p in key)
				if (typeof p == "string")
					this.ele.style[p.camelize()] = key[p] ;
		}else if(typeof key == 'string'){
			if (typeof value == __undef)
				return this.ele.style[key.camelize()] ;
			
			this.ele.style[key.camelize()] = (typeof value == 'function') ? 
				value(this.ele) : value ;
		}	
		return this ;
	} ;
	
	// dom attribute
	/*
	this.attr = function (key,value) {		
		if (typeof key == 'object'){
			for(var p in key){
				if (typeof p == "string"){
					try{
						this.ele[p] = key[p] ;
					}catch(e){
						console.log(this.ele.nodeName+" "+p+" readonly");
					}
				}
			}
		}else if(typeof key == 'string'){
			if (typeof value == __undef) return this.ele[key] ;
			
			if (typeof value == 'function') value = value(this.ele) ;
			
			try{
				this.ele[key] = value ;
			}catch(e){
				console.log(this.ele.nodeName+" "+key+" readonly");
			}
		}	
		return this ;
	};
	this.removeAttr = function(name){
		try{
			this.ele[name] = null ;
		}catch(e){
			console.log(this.ele.nodeName+" "+name+" readonly");
		}
		return this ;
	};
	*/
	this.attr = function (key,value) {		
		if (typeof key == 'object'){
			for(var p in key){
				if (typeof p == "string"){
					try{
						if (Moogens.Browser.mozilla)
							this.ele.setAttribute(p,key[p]);
						else
							this.ele[p] = key[p] ;
					}catch(e){
						console.log(this.ele.nodeName+" "+p+" readonly");
					}
				}
			}
		}else if(typeof key == 'string'){
			if (typeof value == __undef) {
				if (Moogens.Browser.mozilla)
					return this.ele.getAttribute(key);
				return this.ele[key] ;
			}
			if (typeof value == 'function') value = value(this.ele) ;
			
			try{
				this.ele[key] = value ;
			}catch(e){
				console.log(this.ele.nodeName+" "+key+" readonly");
			}
		}	
		return this ;
	};	
	this.removeAttr = function(name){
		try{
			if (Moogens.Browser.mozilla)
				this.ele.setAttribute(name,null);
			else
				this.ele[name] = null ;
		}catch(e){
			console.log(this.ele.nodeName+" "+name+" readonly");
		}
		return this ;
	};
	
	this.val = function(value){
		if (typeof value == __undef) return this.ele['value'] ;
		this.ele['value'] = value ;
		return this ;
	};	
	this.text = function(value){
		if (typeof value == __undef) {
			if (typeof console._1dct == __undef){
				console._1dct  = function(e){
					var ret = '' ;
					if (e && e.nodeType){			
						// 8 注释节点 1 元素节点
						if ( e.nodeType != 8 ){
							Moogens.Utilities.each(e.childNodes,function(){
								ret += this.nodeType == 1 ? console._1dct(this) : this.nodeValue;
							});
						}
					}
					return ret ;
				} ;
			}
			return console._1dct(this.ele) ;			
		}
		this.empty().ele.appendChild(__doc.createTextNode(value));
		return this ;
	};	
	this.html = function(value){
		if (typeof value == __undef) return this.ele['innerHTML'] ;
		try{
			this.ele['innerHTML'] = value.replace(/<script[^>]*>[\S\s]*?<\/script[^>]*>/ig, "");
		}catch(e){
			console.log(this.ele.nodeName+" innerHTML readonly");
		}
		return this ;
	} ;
	this.offset = function(){
		if (this.css('display') == 'none') return {} ;
		
		var _1 = this.ele ;
		var t=_1.offsetTop;  var l=_1.offsetLeft;   
	    while(_1=_1.offsetParent){
	    	t+=_1.offsetTop+(Moogens.Browser.msie? _1.clientTop:0);
	    	l+=_1.offsetLeft+(Moogens.Browser.msie? _1.clientLeft:0);
	    }   
	    return {left:l,top:t};
	}
	
	// 简易效果
	this.show = function(){
		return this.css({display: ''});
	} ;	
	this.hide = function(){
		return this.css({display: 'none'});
	} ;	
	this.toggle = function(){
		this.ele.style.display = this.ele.style.display == '' ? 'none' : '';
		return this ;
	} ;	
	this.resizeTo = function(w,h){
		return this.css({width: w + "px" ,height: h + "px"});
	} ;
	
	// 文档处理
	this.remove = function() {this.ele.parentNode.removeChild(this.ele);} ;
	this.empty = function(){
		while ( this.ele.firstChild ) this.ele.removeChild( this.ele.firstChild );
		return this ;
	};
	
	// dom event bind
	this.focus = function(){
		if (this.ele.focus) this.ele.focus() ;
		return this ;
	} ;	
	this.on = function(type,fn){
		if (typeof fn == 'function')
			Moogens.Dom.Event.add(this.ele,type,fn);
		return this ;
	} ;
	this.un = function(type,fn){
		if (typeof fn == 'function')
			Moogens.Dom.Event.remove(this.ele,type,fn);
		return this ;
	} ;
	this.click = function(fn){
		if (typeof fn == __undef)
			return this.fireEvent('click');
		return this.on('click',fn);
	} ;
	this.dbclick = function(fn){
		if (typeof fn == __undef)
			return this.fireEvent('dblclick');
		return this.on('dblclick',fn);
	} ;
	this.fireEvent = function(type){
		if (typeof type == 'string'){
			type = 'on' + type ;
			if (typeof this.ele.fireEvent == 'function')
				this.ele.fireEvent(type);
			else{
				if (typeof this.ele[type] == 'function')
					this.ele[type]();
			}
		}
		return this ;
	}
};

Moogens.Dom.NodeList = function(elements){
	var node = new Moogens.Dom.Node();
	var list = Moogens.Utilities.arrayMap(elements,function(ele){
		return ele && ele.nodeType ? ele : null ;
	}) ;
	/**
	 * @return Moogens.Dom.Node
	 */
	this.get = function(i){		
		return (typeof i != __undef) && list[i] ? node.setElement(list[i]) : null ;
	} ;
	this.count = function () {
		return list.length;
	} ;	
	this.each = function (fn) {
		for (var i = 0; i < list.length; i++)
			fn.call(this.get(i),i) ;
		return this ;		
	} ;
} ;

Moogens.Dom.XmlEngine = function(){
	var _xml = null; 
	if (window.ActiveXObject){
		_xml = new ActiveXObject("Microsoft.XMLDOM");
		_xml.async=false;
	}else if (__doc.implementation && __doc.implementation.createDocument){
		_xml = __doc.implementation.createDocument("","",null);
	}
	this.load = function(url,callback){
		if (_xml){
			_xml.load(url);
			if (typeof callback == 'function'){
				if (window.ActiveXObject) callback(_xml);
				else 
					_xml.onload = callback;
			}
		}			
	};
//	this.getXmlDoc = function(){return _xml;};
	this.destroy = function(){
		_xml = null;
	};
};

Moogens.Dom.$ = function(selector,context){
	return new Moogens.Dom.NodeList(Moogens.Dom.get(selector,context));
} ;

Moogens.Dom.Event = {
	add: function(obj,type,fn){
		obj["e"+type+fn] = fn;
		if (obj.addEventListener) obj.addEventListener(type, fn, false);
		else if (obj.attachEvent){			
			obj[type+fn] = function() {obj["e"+type+fn](window.event);};
			obj.attachEvent("on"+type, obj[type+fn]);
		}
	} ,	
	remove: function (obj, type, fn){
		if (obj.removeEventListener) obj.removeEventListener(type, obj["e"+type+fn], false);
		else if (obj.detachEvent) {
			obj.detachEvent("on"+type, obj[type+fn]);
		}
		obj[type+fn] = null;
		obj["e"+type+fn] = null;
	} ,	
	preventDefault: function(evt){
		// 取消元素默认行为的方法
		evt = evt || window.event ;
		if (evt.preventDefault)
			evt.preventDefault();
		else
			evt.returnValue = false ;
	} ,
	preventBubble: function(evt){
		// 取消元素上层元素的事件冒泡
		evt = evt || window.event ;
		if (evt.stopPropagation)
			evt.stopPropagation();
		else
			evt.cancelBubble = true ;
	} ,
	keyCode: function(evt){
		evt = evt || window.event ;
		return evt.keyCode || evt.charCode || 0 ;
	} ,
	/**
	 * 事件委托 机制 -- 从上层元素捕捉事件源,并传到回调函数 
	 * 
	 * 兼容IE和FF
	 * @param DOM元素	proxyElement 
	 * @param string	type
	 * @param function	fn 传入参数为事件源对象
	 * @param bool		isPreventDefault 是否阻止元素的默认行为
	 */ 
	addProxy: function(proxyElement,type,fn,isPreventDefault){
		var handle = type + '_handle' ;
		var _this = this ;
		proxyElement[handle] = function(evt){
			evt = evt || window.event ;
			var target = evt.target || evt.srcElement ;
			fn(target);
			if (isPreventDefault) _this.preventDefault(evt);
		} ; 
		this.add(proxyElement,type,proxyElement[handle]);
	},
	/**
	 * 移除 proxyElement的委托事件
	 * 
	 * @param DOM元素	proxyElement
	 * @param string	type
	 */
	removeProxy: function(proxyElement,type){
		var handle = type + '_handle' ;
		this.remove(proxyElement,type,proxyElement[handle])
	}
} ;

// Queue 队列: 先进先出
Moogens.Queue = function(){
	
	var vol = Moogens.Utilities.toArray(arguments);
	this.size = vol.length;
	
	this.push = function(item){
		vol.push(item);
		this.size ++ ;
	};
	
	this.shift = function(){
		if (!this.size) return null;
		this.size -- ;
		return vol.shift();
	};
	
	this.empty = function(){
		vol = [];
		this.size = 0;
	};
	
	this.reverse = function(){
		vol.reverse();
	};
};


})();
