"use strict";

require(["./config"], function () {
  require(["muimin", "swiper"], function (muimin, swiper) {
    mui.init();
    var swipers = new swiper("#swiper", {
      pagination: {
        el: '.swiper-pagination'
      }
    });
    var ullist = document.getElementsByClassName("ullist");
    var save = document.getElementsByClassName("save")[0];
    var classify = document.getElementById("classify");
    var back = document.getElementById("back");
    var currentname = document.getElementById("currentname");
    var type = decodeURIComponent(location.search.split("=")[1]); //获取地址栏传过来的支出或者收入方式

    rendericonAll();
    addEvent();

    function rendericonAll() {
      //渲染所有的icon
      mui.ajax('/icon/api/findicon', {
        dataType: 'json',
        //服务器返回json格式数据
        type: 'post',
        //HTTP请求类型 
        headers: {
          'Content-Type': 'application/json'
        },
        success: function success(data) {
          if (data.code == 1) {
            var str = '';
            data.msg.forEach(function (item) {
              str += "<li><span class=\"".concat(item.icon, "\"></span></li>");
            });

            for (var i = 0; i < ullist.length; i++) {
              ullist[i].innerHTML = str;
            }
          }
        }
      });
    }

    function addEvent() {
      //绑定事件
      mui(ullist).on("tap", "span", function () {
        //点击所有的icon
        currentname.className = this.className; //获取点击的icon图标 赋值给默认的选项

        save.addEventListener("tap", function () {
          //点击保存，判断分类是否为空，若为空，不能提交
          var icon = currentname.className;
          var cid = classify.value;

          if (cid.length != 0) {
            mui.ajax('/classify/api/addclassify', {
              data: {
                uid: "5c343c924b7e859018e94c75",
                icon: icon,
                cid: cid,
                type: type
              },
              dataType: 'json',
              //服务器返回json格式数据
              type: 'post',
              //HTTP请求类型 
              headers: {
                'Content-Type': 'application/json'
              },
              success: function success(data) {
                if (data.code == 1) {
                  window.location.href = "addbill.html";
                }
              }
            });
          } else {
            alert("请输入分类名称");
          }
        });
      });
      back.addEventListener("tap", function () {
        //点击返回，跳回页面
        location.href = "addbill.html";
      });
    }
  });
});