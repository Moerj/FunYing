"use strict";var addChargeList=function(){for(var e="",t=[20,50,100,200],n=0;n<t.length;n++){var a=0==n?"checked":"",o=n+1;e+='\n                <li>\n                    <input type="radio" name="chargeRadio" id="chargeRadio-'+o+'" '+a+" data-productId="+o+'>\n                    <label class="splitline" for="chargeRadio-'+o+'"><span class="price">'+$.formatAmount(t[n])+'</span><i class="fa fa-check"></i></label>\n                </li>\n            '}$(".chargelist").append(e)},selectedProductId=function(){return $("input[type=radio]:checked").attr("data-productId")},$chargeBtn=$("#chargeOk");addChargeList(),$chargeBtn.click(function(){$.wxPay({type:2,productId:selectedProductId(),title:"个人中心-余额充值"},function(){$.msg({text:"充值成功，可以买片啦！",timeout:5e3,callback:function(){$.page_me_reload(),$.router.back()}})})}),$("#feedbackSubmit").click(function(){$.ajax({url:"http://www.funying.cn/wx/rest/user/addFeedBack",data:{openId:$.openId,content:$("#feedbackText").val()},success:function(e){console.log(e),1==e.STATUS?$.msg({text:"小编已接到圣旨，谢谢反馈！",timeout:3e3,callback:function(){$.router.back()}}):$.msg("反馈出现了问题，估计系统繁忙，请稍后试试！")},error:function(e){console.log(e),$.msg("系统繁忙，请稍后试试！")}})});var makePie=function(e){for(var t=[],n=0;n<e.length;n++)t.push({value:e[n].value,itemStyle:{normal:{color:e[n].color}}});var a={silent:!0,series:[{name:"访问来源",type:"pie",radius:["50%","70%"],avoidLabelOverlap:!1,labelLine:{normal:{show:!1}},data:t}]};window.echarts.init($(".echart")[0]).setOption(a)},$uploadPicker=$("#headpicUpload"),$headimg=$("#headerImg");$.page_me_reload=function(){$.ajax({url:"http://www.funying.cn/wx/rest/user/index",data:{openId:$.openId},success:function(e){if(console.log("个人中心首页数据：",e),1==e.STATUS&&e.DATA){var t=e.DATA;for(var n in t)$("#"+n).text(t[n]);var a=Number($("#rechargeAmount").text()),o=Number($("#lucreAmount").text()),i=[{name:"收益余额",color:"#F36C60",value:o},{name:"充值余额",color:"#FFC107",value:a}];makePie(i),$(".overage").init($.formatAmount(a+o)),$("#withdraw-amount").init(o),$(".headpic").init(t.headerImg||"../images/icon/user.png");var r=$("#entry-qrcode");r.attr("href",r.attr("href")+("?openid="+$.openId))}else $.alert(e.MSG)}})},$.page_me_reload(),$uploadPicker.change(function(){function e(e){$.ajax({url:"http://www.funying.cn/wx/rest/user/updateImg",data:{openId:$.openId,img:e},success:function(e){1==e.STATUS?$.toast("头像上传成功"):$.alert("上传失败，请稍后再试！")},error:function(){$.alert("上传失败，请稍后再试！"),console.error("接口部分头像上传失败")},complete:function(){$.hidePreloader()}})}var t=new FormData,n=$(this),a=n.get(0).files,o="http://118.178.136.60:8080/ercsvc-upload/upload",i=window.URL.createObjectURL($uploadPicker[0].files[0]);return $.showPreloader("正在压缩图片"),lrz(a[0],{width:120}).then(function(n){console.log("图片已压缩：",n),t.append("imgFile",n.file),$.showPreloader("正在上传头像"),$.ajax({url:o,type:"post",data:t,cache:!1,contentType:!1,processData:!1,dataType:"json",success:function(t){console.log("上传结果：",t),t[0].result&&($headimg.attr("src",i),e("http://www.funying.cn/img"+t[0].result))},error:function(){$.alert("上传失败，请稍后再试！"),console.error("ftp部分头像上传失败"),$.hidePreloader()}})})["catch"](function(e){$.alert("图片压缩失败，请换一张试试"),$.hidePreloader()}).always(function(){}),!1}),setTimeout(function(){function e(){function e(){0==n.children(".messageList").length&&n.hide()}function t(t){var n=$(t),a=n.attr("msgId");n.parents(".messageList").remove(),e(),$.ajax({url:"http://www.funying.cn/wx/rest/user/delSystemMsg",data:{openId:$.openId,msgId:a},success:function(e){1==e.STATUS&&console.log("id:"+a+" 消息删除成功!")}})}var n=$(".message-contanier ul");new ScrollLoad({cache:!1,scrollContanier:n,template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n];a&&(t+='\n                        <li class="messageList">\n                            <a href='+("./articleDetails.html?id="+a.id+"&oldOpenId="+$.openId)+' class="message external">\n                                <p class="Title">\n                                    <span class="name">'+(a.title?a.title:"")+'</span>\n                                    <span class="day">'+a.addTime+'</span>\n                                </p>\n                                <p class="details">'+a.context+'</p>\n                                <span class="delete" msgId='+a.id+"></span>\n                            </a>\n                        </li>\n                        ")}return t},ajax:function(t){$.ajax({url:"http://www.funying.cn/wx/rest/user/systemMsg",data:{openId:$.openId,skip:this.currentPage,limit:this.perload},success:function(e){console.log("系统消息：",e),e.DATA.length?t(e.DATA):console.log("系统消息：没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){e()}})}}),$(document).on("swipeLeft",".message",function(){$(this).addClass("showDelete")}).on("swipeRight",".message",function(){$(this).removeClass("showDelete")}).on("click",".messageList .delete",function(){return t(this),!1})}$.pageInit({hash:"page-message",entry:"#entry-message",init:function(){e()}})},100),setTimeout(function(){function e(){var e=$(".myMovieList");new ScrollLoad({cache:!1,scrollContanier:e,template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n];t+='\n                    <a class="box external" href="'+$.getMovDetails(a.id)+'">\n                        <div class="imgbox">\n                            <img src="'+a.poster+'" alt="">\n                        </div>\n                        <div class="info">\n                            <span class="Title">'+a.title+'</span>\n                            <p class="text">'+a.introduction+'</p>\n                            <span class="text2">'+$.getUpdateStatus(a.updateStatus,a.updateSite)+'</span>\n                        </div>\n                        <span class="info2">\n                            <span>下单时间: '+a.updateTime+'</span>\n                            <span class="price">'+a.price+"</span>\n                        </span>\n                    </a>\n                    "}return t},ajax:function(t){$.ajax({url:"http://www.funying.cn/wx/rest/user/myMovie",data:{state:1,openId:$.openId,skip:this.currentPage,limit:this.perload},success:function(n){console.log("我的影片：",n),n.DATA.length?t(n.DATA):(e.hide(),console.log("我的影片没有数据"))},error:function(e){console.warn("我的影片加载失败",e),$.alert("加载失败，请稍后再试！")}})}})}$.pageInit({hash:"page-myMovie",entry:"#entry-myMovie",init:function(){e()}})},100),setTimeout(function(){function e(){new ScrollLoad({cache:!1,scrollContanier:"#profitScrollContanier",listContanier:"#profitList",template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n],o=a.one_level_amount||a.second_level_amount||a.three_level_amount||"",i=void 0,r=void 0,s=void 0;switch(Number(a.type)){case 1:r="one",i="从一级推客"+o+"获取收益",s=a.charge_amount;break;case 2:r="two",i="从二级推客"+o+"获取收益",s=a.charge_amount;break;case 3:r="three",i="从三级推客"+o+"获取收益",s=a.charge_amount;break;case 4:i="提现",s=a.profit_amount,r="other";break;case 5:i="消费",s=a.profit_amount,r="other";break;case 6:i="充值",s=a.charge_amount,r="other"}var c=a.add_time.split(" "),l=c[0],u=c[1];t+="\n                    <li class="+r+'>\n                        <div class="date">\n                            <div class="day">'+l+'</div>\n                            <div class="time">'+u+'</div>\n                        </div>\n                        <div class="info">\n                            <img class="i1" src='+(a.image||"../images/icon/user.png")+' alt="">\n                            <div class="i2">\n                                <span class="num">'+(a.charge_amount?"+":"-")+s+'</span>\n                                <span class="text">'+i+"</span>\n                            </div>\n                        </div>\n                    </li>\n                    "}return t},ajax:function(e){$.ajax({url:"http://www.funying.cn/wx/rest/pay/detail",data:{openId:$.openId,skip:this.currentPage,limit:this.perload},success:function(t){if(console.log("收益明细：",t),1==t.STATUS){e(t.data);var n=t.yestAmt;n=n>=0?"+"+n:"-"+n,$("#profit-yestAmt").text($.formatAmount(n)),$("#profit-LucreAmt").text($.formatAmount(t.oneAmt+t.secondAmt+t.threeAmt)),$("#profit-oneAmt").text($.formatAmount(t.oneAmt)),$("#profit-secondAmt").text($.formatAmount(t.secondAmt)),$("#profit-threeAmt").text($.formatAmount(t.threeAmt))}else console.log("收益明细没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){}})}})}function t(e,t){var n=void 0;switch(Number(t)){case 1:n="一";break;case 2:n="二";break;case 3:n="三"}$(e).find(".pageName").text("我的"+n+"级推客"),new ScrollLoad({scrollContanier:e+" .con2",listContanier:e+" .list",cache:!1,template:function(e){for(var t="",n=0;n<e.length;n++){var a=e[n],o=a.one_level_amount||a.second_level_amount||a.three_level_amount||"未知推客";t+='\n                    <li>\n                        <div class="info">\n                            <img src='+(a.image||"../images/icon/user.png")+'>\n                            <div class="text">\n                                <span class="name">'+o+'</span>\n                                <span class="num">+'+a.charge_amount+"</span>\n                            </div>\n                        </div>\n                    </li>\n                    "}return t},ajax:function(a){$.ajax({url:"http://www.funying.cn/wx/rest/pay/twitterDetail",data:{type:t,openId:$.openId,skip:this.currentPage,limit:this.perload},success:function(o){if(console.log(t+"级推客：",o),1==o.STATUS){if(a(o.data),o.month){var i=$.formatAmount(o.month);i=i>=0?"+"+i:"-"+i,$(e+" .con1 .num").text(i)}o.totalAmt&&$(e+" .con1 .total").text($.formatAmount(o.totalAmt))}else console.log(n+"级推客没有数据")},error:function(e){console.log(e),$.alert("刷新失败，请稍后再试！")},complete:function(){}})}})}function n(){e(),t("#page-profit-1",1),t("#page-profit-2",2),t("#page-profit-3",3)}$.pageInit({hash:"page-profit",entry:"#entry-profit",init:function(){n()}})},100);var ajax_cash=function(){console.log($.openId),console.log($withdrawInput.val()),$.showIndicator(),$.ajax({url:"http://www.funying.cn/wx/rest/pay/cash",data:{openId:$.openId,price:$withdrawInput.val()},success:function(e){1==e.STATUS?($.msg("预约提现成功！",5e3),setTimeout(function(){$.page_me_reload(),$.router.back()},5e3)):$.msg("提现失败，请小主稍后再试！",5e3)},error:function(){$.alert("提现失败，服务器繁忙！")},complete:function(){$.hideIndicator()}})},$withdrawOk=$("#withdrawOk"),$withdrawInput=$("#withdrawInput");$withdrawOk.click(function(){return $withdrawInput.val()?$withdrawInput.val()<10?void $.msg("提现金额不能低于限制"):void ajax_cash():void $.msg("提现金额不能为空")}),$withdrawInput.on("keyup",function(){var e=Boolean(!$(this).val());$withdrawOk.prop("disabled",e)});