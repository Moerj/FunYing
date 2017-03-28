"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,i,n){return i&&t(e.prototype,i),n&&t(e,n),e}}(),ScrollLoad=function(){function t(e){var i=this;_classCallCheck(this,t),e.scrollContanier=$(e.scrollContanier),void 0!=e.listContanier&&(e.listContanier=$(e.listContanier));var n={maxload:1e3,perload:27,isloading:!1,iscomplate:!1,currentPage:1,listContanier:e.scrollContanier,scrollContanier:e.scrollContanier,cache:!0};e=$.extend({},n,e);for(var o in e)e.hasOwnProperty(o)&&(this[o]=e[o]);this.loadEffect=$('\n            <div class="infinite-scroll-preloader">\n                <div class="preloader"></div>\n            </div>\n        ').appendTo(this.listContanier),this.perload>this.maxload&&(this.perload=this.maxload),this.scrollContanier.on("scroll",function(){i.scroll()}),this.cache&&history.state&&history.state.data?this.render(history.state.data):this.ajax(function(t){i._ajax(t)})}return _createClass(t,[{key:"_ajax",value:function(t){t.length?(this.currentPage++,this.render(t),t.length<this.perload&&this.finish()):this.finish()}},{key:"_cache",value:function(t){if(!this.cache)return t;var e=history.state.data||{},i=t,n=e.length,o=void 0;if(!this._cache.run){var a=!1;this.scrollContanier.on("scroll click",function(t){var e=this,i=function(){var t=$(e).scrollTop(),i=Object.assign(history.state,{scrollTop:t});history.replaceState(i,"","")};a||(a=!0,setTimeout(function(){a=!1,"scroll"===t.type&&i()},300),"click"===t.type&&i())})}if(n>0&&!this._cache.run)this.currentPage=history.state.currentPage,console.info("load cache data"),o=e;else{var s=void 0;if(n>0){s=Object.assign({},e);for(var r=0;r<i.length;r++)s[n]=i[r],n++;s.length=n}else s=i;history.replaceState({data:s,currentPage:this.currentPage,scrollTop:this.scrollContanier.scrollTop()},"",""),console.info("load ajax data"),o=i}return this._cache.run=!0,o}},{key:"cleanCache",value:function(){history.replaceState({data:{},currentPage:1,scrollTop:0},"","")}},{key:"scroll",value:function(){var t=this;if(!(this.isloading||this.iscomplate||this.scrollContanier.scrollTop()+this.scrollContanier.height()+100<this.scrollContanier[0].scrollHeight)){if(this.listContanier.children().length>=this.maxload)return void this.finish();this.isloading=!0,this.ajax(function(e){t.isloading=!1,t._ajax(e)})}}},{key:"reload",value:function(t){var e=this;this.scrollContanier[0].scrollTop=0,this.loadEffect.html('<div class="preloader"></div>'),this.currentPage=1,this.isloading=!1,this.iscomplate=!1,this.ajax(function(i){e.listContanier.empty(),e._ajax(i),t()})}},{key:"finish",value:function(){this.iscomplate=!0;var t=this.loadEffect[0].offsetTop,e=this.listContanier.height()-parseInt(this.listContanier.css("padding-top"));t>e-10?this.loadEffect.text("已经到底了！"):this.loadEffect.text("")}},{key:"render",value:function(t){t=this._cache(t),this.perload<t.length&&!this.cache&&(t.length=this.perload);var e=this.template(t);this.listContanier.append(e),this.loadEffect.appendTo(this.listContanier),this.cache&&this.scrollContanier.scrollTop(history.state.scrollTop)}}]),t}();setTimeout(function(){var t=$(".scroll");if(0!=t.length){t.on("touchstart",function(t){var e=$(this)[0],i=e.scrollTop,n=e.scrollHeight,o=i+e.offsetHeight;0===i?e.scrollTop=1:o===n&&(e.scrollTop=i-1)}),t.on("touchmove",function(t){var e=$(this)[0];e.offsetHeight<e.scrollHeight&&(t._isScroller=!0)});var e=$("body").off("touchmove");e.on("touchmove",function(t){t._isScroller||t.preventDefault()})}},100),$(document).on("click",".getMovie",function(){function t(t){var e=$(".movieDetails");e.find(".pic").attr("src",t.MOVIE.poster)}var e=$(this),i=e.attr("movieId");$.ajax({type:"get",url:"http://www.funying.cn/wx/rest/index/getMovie",data:{movieId:i},success:function(e){console.log(e),t(e)},error:function(t){console.log("影视详情页获取失败。",t)}})}),$.fn.init=function(t){if(null!=t)for(var e=0;e<this.length;e++){var i=$(this[e]);"img"===this[e].localName?i.attr("src",t):void 0==i.val()?i.text(t):i.val(t),i.removeClass("hide").css("visibility","visible").show()}else this.removeClass("hide").css("visibility","visible")},$.GetQueryString=function(t){var e=new RegExp("(^|&)"+t+"=([^&]*)(&|$)"),i=window.location.search.substr(1).match(e);return null!=i?unescape(i[2]):null},$.openId=$.GetQueryString("openid"),null===$.openId?$.openId=sessionStorage.openId:sessionStorage.openId=$.openId,$.getMovDetails=function(t){return"./movieDetails.html?movieId="+t+"&oldOpenId="+$.openId},$.getArtDetails=function(t){return"./articleDetails.html?articleId="+t+"&oldOpenId="+$.openId},$.msg=function(t,e){var i=t.text||t,n=t.title||"温馨提示",o=t.callback;void 0===e&&(e=t.timeout||2e3);var a=$('\n        <div class="mask">\n            <div class="msg">\n                <p class="msg-title">'+n+'</p>\n                <p class="msg-text">'+i+"</p>\n            </div>\n        </div>\n    ");$("body").append(a),e&&setTimeout(function(){a.remove(),o&&o()},e)},$.payment=function(t){function e(){$.showPreloader("购买中，稍等..."),$.ajax({url:"http://www.funying.cn/wx/rest/pay/payByRecharge",data:{openId:$.openId,movieId:t.productId},success:function(e){console.log("余额支付接口",e),1==e.STATUS?t.success():$.msg("账户余额不足，请充值或使用微信支付！",5e3)},error:function(){$.msg("系统繁忙，请稍后再尝试支付操作！")},complete:function(){$.hidePreloader()}})}var i=[{text:"账户余额支付",onClick:function(){e()}},{text:"取消"}];$.actions(i)},$.wxPay=function(t,e){var i={type:t.type,title:t.title,openId:$.openId,productId:t.productId,url:location.href.split("#")[0]};console.log("统一下单接口参数",i),$.showIndicator(),$.ajax({url:"http://www.funying.cn/movie/rest/pay/toPay",data:i,success:function(t){console.log("统一下单接口：",t),wx.config({appId:t.appId,timestamp:t.timestamp,nonceStr:t.nonceStr,signature:t.signature,jsApiList:["chooseWXPay"]}),wx.ready(function(){wx.chooseWXPay({appId:t.appId,timestamp:t.timestamp,nonceStr:t.nonceStr,"package":"prepay_id="+t.prepay_id,signType:t.signType,paySign:t.paySign,success:function(t){"chooseWXPay:ok"==t.errMsg?e():alert(t.errMsg)},cancel:function(t){$.msg("支付取消")},fail:function(){$.msg("充值失败，请小主稍后再试！",5e3)}})})},error:function(t){$.alert("充值服务初始化失败，请稍后再试！"),console.log("充值失败",t)},complete:function(){$.hideIndicator()}})},$.pageInit=function(t){$(t.entry).one("click",function(){t.init()}),location.hash.indexOf(t.hash)>0&&(t.init(),$(t.entry).off("click"))},$.formatAmount=function(t){return t=Number(t),t?t.toFixed(2):0},$.getUpdateStatus=function(t,e){return 0==t?e?"第"+e+"集":"更新中":"已完结"},$.shareConfig=function(t){$.ajax({url:"http://www.funying.cn/wx/rest/pay/getSignConf",data:{url:location.href.split("#")[0]},success:function(e){t(e)}})},$.htmlFilter=function(t){return t=t.replace(/<[^>]+>/g,""),t=t.replace(/&nbsp;/gi,"")};