"use strict";!function(){var e=function(){for(var e="",t=[20,50,100,200],n=0;n<t.length;n++){var a=0==n?"checked":"",o=n+1;e+='\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-'+o+'" '+a+" data-productId="+o+'>\n                    <label class="splitline" for="chargeRadio-'+o+'"><span class="price">'+$.formatAmount(t[n])+'</span><i class="fa fa-check"></i></label>\n                </li>\n            '}$(".chargelist").append(e)},t=function(){return $("input[type=radio]:checked").attr("data-productId")},n=$("#chargeOk");e(),n.click(function(){$.wxPay({type:2,productId:t(),title:"个人中心-余额充值"},function(){$.msg({text:"充值成功，可以买片啦！",timeout:5e3,callback:function(){$.page_me_reload(),$.router.back()}})})})}(),$("#feedbackSubmit").click(function(){$.ajax({url:"http://www.funying.cn/wx/rest/user/addFeedBack",data:{openId:$.openId,content:$("#feedbackText").val()},success:function(e){console.log(e),1==e.STATUS?$.msg({text:"小编已接到圣旨，谢谢反馈！",timeout:3e3,callback:function(){$.router.back()}}):$.msg("反馈出现了问题，估计系统繁忙，请稍后试试！")},error:function(e){console.log(e),$.msg("系统繁忙，请稍后试试！")}})}),!function(){var e=function(e){for(var t=[],n=0;n<e.length;n++)t.push({value:e[n].value,itemStyle:{normal:{color:e[n].color}}});var a={silent:!0,series:[{name:"访问来源",type:"pie",radius:["50%","70%"],avoidLabelOverlap:!1,labelLine:{normal:{show:!1}},data:t}]};window.echarts.init($(".echart")[0]).setOption(a)},t=$("#headpicUpload"),n=$("#headerImg");$.page_me_reload=function(){$.ajax({url:"http://www.funying.cn/wx/rest/user/index",data:{openId:$.openId},success:function(t){if(console.log("个人中心首页数据：",t),1==t.STATUS&&t.DATA){var n=t.DATA;for(var a in n)$("#"+a).text(n[a]);var o=Number($("#rechargeAmount").text()),s=Number($("#lucreAmount").text()),i=[{name:"收益余额",color:"#F36C60",value:s},{name:"充值余额",color:"#FFC107",value:o}];e(i),$(".overage").init($.formatAmount(o+s)),$("#withdraw-amount").init(s),$(".headpic").init(n.headerImg||"../images/icon/user.png")}else $.alert(t.MSG)}})},$.page_me_reload(),t.change(function(){function e(e){$.ajax({url:"http://www.funying.cn/wx/rest/user/updateImg",data:{openId:$.openId,img:e},success:function(e){1==e.STATUS?$.toast("头像上传成功"):$.alert("上传失败，请稍后再试！")},error:function(){$.alert("上传失败，请稍后再试！"),console.error("接口部分头像上传失败")},complete:function(){$.hidePreloader()}})}var a=new FormData,o=$(this),s=o.get(0).files,i="http://118.178.136.60:8080/ercsvc-upload/upload",r=window.URL.createObjectURL(t[0].files[0]);return $.showPreloader("正在压缩图片"),lrz(s[0],{width:120}).then(function(t){console.log("图片已压缩：",t),a.append("imgFile",t.file),$.showPreloader("正在上传头像"),$.ajax({url:i,type:"post",data:a,cache:!1,contentType:!1,processData:!1,dataType:"json",success:function(t){console.log("上传结果：",t),t[0].result&&(n.attr("src",r),e("http://www.funying.cn/img"+t[0].result))},error:function(){$.alert("上传失败，请稍后再试！"),console.error("ftp部分头像上传失败"),$.hidePreloader()}})}).catch(function(e){$.alert("图片压缩失败，请换一张试试"),$.hidePreloader()}).always(function(){}),!1})}(),setTimeout(function(){function e(){function e(){0==n.children(".messageList").length&&n.hide()}function t(t){var n=$(t),a=n.attr("msgId");n.parents(".messageList").remove(),e(),$.ajax({url:"http://www.funying.cn/wx/rest/user/delSystemMsg",data:{openId:$.openId,msgId:a},success:function(e){1==e.STATUS&&console.log("id:"+a+" 消息删除成功!")}})}var n=$(".message-contanier ul");new ScrollLoad({scrollContanier:n,template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n];a&&(t+='\n                        <li class="messageList">\n                            <a href='+("./articleDetails.html?id="+a.id+"&oldOpenId="+$.openId)+' class="message external">\n                                <p class="Title">\n                                    <span class="name">'+(a.title?a.title:"")+'</span>\n                                    <span class="day">'+a.addTime+'</span>\n                                </p>\n                                <p class="details">'+a.context+'</p>\n                                <span class="delete" msgId='+a.id+"></span>\n                            </a>\n                        </li>\n                        ")}return t},ajax:function(t,n){$.ajax({url:"http://www.funying.cn/wx/rest/user/systemMsg",data:t,success:function(e){console.log("系统消息：",e),e.DATA.length?n(e.DATA):console.log("系统消息：没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){e()}})}}),$(document).on("swipeLeft",".message",function(){$(this).addClass("showDelete")}).on("swipeRight",".message",function(){$(this).removeClass("showDelete")}).on("click",".messageList .delete",function(){return t(this),!1})}$.pageInit({hash:"page-message",entry:"#entry-message",init:function(){e()}})},100),setTimeout(function(){function e(){var e=$(".myMovieList");new ScrollLoad({scrollContanier:e,template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n];t+='\n                    <a class="box external" href="'+$.getMovDetails(a.id)+'">\n                        <div class="imgbox">\n                            <img src="'+a.poster+'" alt="">\n                        </div>\n                        <div class="info">\n                            <span class="Title">'+a.title+'</span>\n                            <p class="text">'+a.introduction+'</p>\n                            <span class="text2">'+$.getUpdateStatus(a.updateStatus,a.updateSite)+'</span>\n                        </div>\n                        <span class="info2">\n                            <span>下单时间: '+a.updateTime+'</span>\n                            <span class="price">'+a.price+"</span>\n                        </span>\n                    </a>\n                    "}return t},ajax:function(t,n){$.ajax({url:"http://www.funying.cn/wx/rest/user/myMovie",data:{openId:$.openId,state:1},success:function(t){console.log("我的影片：",t),t.DATA.length?n(t.DATA):(e.hide(),console.log("我的影片没有数据"))},error:function(e){console.warn("我的影片加载失败",e),$.alert("加载失败，请稍后再试！")}})}})}$.pageInit({hash:"page-myMovie",entry:"#entry-myMovie",init:function(){e()}})},100),setTimeout(function(){function e(){new ScrollLoad({scrollContanier:"#profitScrollContanier",listContanier:"#profitList",template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n],o=a.one_level_amount||a.second_level_amount||a.three_level_amount||"",s=void 0,i=void 0,r=void 0;switch(Number(a.type)){case 1:i="one",s="从一级推客"+o+"获取收益",r=a.charge_amount;break;case 2:i="two",s="从二级推客"+o+"获取收益",r=a.charge_amount;break;case 3:i="three",s="从三级推客"+o+"获取收益",r=a.charge_amount;break;case 4:s="提现",r=a.profit_amount,i="other";break;case 5:s="消费",r=a.profit_amount,i="other";break;case 6:s="充值",r=a.charge_amount,i="other"}var c=a.add_time.split(" "),l=c[0],u=c[1];t+="\n                    <li class="+i+'>\n                        <div class="date">\n                            <div class="day">'+l+'</div>\n                            <div class="time">'+u+'</div>\n                        </div>\n                        <div class="info">\n                            <img class="i1" src='+(a.image||"../images/icon/user.png")+' alt="">\n                            <div class="i2">\n                                <span class="num">'+(a.charge_amount?"+":"-")+r+'</span>\n                                <span class="text">'+s+"</span>\n                            </div>\n                        </div>\n                    </li>\n                    "}return t},ajax:function(e,t){$.ajax({url:"http://www.funying.cn/wx/rest/pay/detail",data:e,success:function(e){if(console.log("收益明细：",e),1==e.STATUS){t(e.data);var n=e.yestAmt;n=n>=0?"+"+n:"-"+n,$("#profit-yestAmt").text($.formatAmount(n)),$("#profit-LucreAmt").text($.formatAmount(e.oneAmt+e.secondAmt+e.threeAmt)),$("#profit-oneAmt").text($.formatAmount(e.oneAmt)),$("#profit-secondAmt").text($.formatAmount(e.secondAmt)),$("#profit-threeAmt").text($.formatAmount(e.threeAmt))}else console.log("收益明细没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){}})}})}function t(e,t){var n=void 0;switch(Number(t)){case 1:n="一";break;case 2:n="二";break;case 3:n="三"}$(e).find(".pageName").text("我的"+n+"级推客"),new ScrollLoad({scrollContanier:e+" .con2",listContanier:e+" .list",template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n],o=a.one_level_amount||a.second_level_amount||a.three_level_amount||"未知推客";t+='\n                    <li>\n                        <div class="info">\n                            <img src='+(a.image||"../images/icon/user.png")+'>\n                            <div class="text">\n                                <span class="name">'+o+'</span>\n                                <span class="num">+'+a.charge_amount+"</span>\n                            </div>\n                        </div>\n                    </li>\n                    "}return t},ajax:function(a,o){a=$.extend(a,{type:t}),$.ajax({url:"http://www.funying.cn/wx/rest/pay/twitterDetail",data:a,success:function(a){if(console.log(t+"级推客：",a),1==a.STATUS){if(o(a.data),a.month){var s=$.formatAmount(a.month);s=s>=0?"+"+s:"-"+s,$(e+" .con1 .num").text(s)}a.totalAmt&&$(e+" .con1 .total").text($.formatAmount(a.totalAmt))}else console.log(n+"级推客没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){}})}})}function n(){e(),t("#page-profit-1",1),t("#page-profit-2",2),t("#page-profit-3",3)}$.pageInit({hash:"page-profit",entry:"#entry-profit",init:function(){n()}})},100),!function(){var e=function(){console.log($.openId),console.log(n.val()),$.showIndicator(),$.ajax({url:"http://www.funying.cn/wx/rest/pay/cash",data:{openId:$.openId,price:n.val()},success:function(e){1==e.STATUS?($.msg("提现成功，荷包胀起来了！",5e3),setTimeout(function(){$.page_me_reload(),$.router.back()},5e3)):$.msg("提现失败，请小主稍后再试！",5e3)},error:function(){$.alert("提现失败，服务器繁忙！")},complete:function(){$.hideIndicator()}})},t=$("#withdrawOk"),n=$("#withdrawInput");t.click(function(){return n.val()?n.val()<10?void $.msg("提现金额不能低于限制"):void e():void $.msg("提现金额不能为空")}),n.on("keyup",function(){var e=Boolean(!$(this).val());t.prop("disabled",e)})}();