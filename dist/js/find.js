"use strict";setTimeout(function(){function e(e){n.eq(e).find(".fa").toggleClass("isopen")}function t(e,t){n.eq(e).find("b").text(t)}sessionStorage.sort=sessionStorage.sort||1,sessionStorage.first_type=sessionStorage.first_type||"",sessionStorage.type=sessionStorage.type||"";var s=new ScrollLoad({scrollContanier:".infinite-scroll",listContanier:".find-content",template:function(e){for(var t="",s=0;s<e.length;s++){var n=e[s];t+='\n                <a href="'+$.getMovDetails(n.id)+'" class="find-list external">\n                    <div class="imgbox">\n                        <img src="'+n.poster+'" alt="">\n                        <div class="status">'+$.getUpdateStatus(n.updateStatus,n.updateSite)+'</div>\n                    </div>\n                    <p class="name">'+n.title+"</p>\n                </a>\n                "}return t},ajax:function(e,t){e=$.extend({},e,{sort:Number(sessionStorage.sort),first_type:sessionStorage.first_type,type:sessionStorage.type}),$.ajax({url:"http://www.funying.cn/wx/rest/find/all",data:e,success:function(e){console.log("发现",e),e.DATA?t(e.DATA):$.alert("没有数据了")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")}})}}),n=$(".select-switch"),o=0;n.eq(o).picker({toolbarTemplate:'<header class="find-select"></header>',cols:[{textAlign:"center",values:["更新时间","人气排行"]}],onOpen:function(){e(o)},onClose:function(n){e(o),sessionStorage.sort="更新时间"==n.value[0]?1:2,s.reload();var a=n.value;t(o,a)}});var a=1;n.eq(a).picker({toolbarTemplate:'<header class="find-select"></header>',cols:[{textAlign:"center",values:["全部","电影","电视剧","动画","演唱会","娱乐","体育","游戏","周边","其他"]}],onOpen:function(){e(a)},onClose:function(n){e(a),sessionStorage.first_type="全部"==n.value[0]?"":n.value[0],s.reload();var o="全部"==n.value?"类型":n.value;t(a,o)}}),""!==sessionStorage.first_type&&t(a,sessionStorage.first_type);var i=2;n.eq(i).picker({toolbarTemplate:'<header class="find-select"></header>',cols:[{textAlign:"center",values:["全部","经典","华语","欧美","韩国","日本","动作","喜剧","爱情","科幻","悬疑","恐怖","豆瓣高分","冷门佳片"]}],onOpen:function(){e(i)},onClose:function(n){e(i),sessionStorage.type="全部"==n.value[0]?"":n.value[0],s.reload();var o="全部"==n.value?"fun类":n.value;t(i,o)}}),""!==sessionStorage.type&&t(i,sessionStorage.type),$(document).on("click",".picker-item",function(){$.closeModal(".picker-modal.modal-in")})},100);