"use strict";

require(["./config"], function () {
  require(["muimin", "jquery", "picker"], function (muimin, $, picker) {
    mui.init();
    render();
    removelist(); //删除行

    var ullist = document.getElementById("OA_task_1");
    var incomenode = document.getElementsByClassName("income")[0];
    var expendnode = document.getElementsByClassName("expend")[0];
    var surplusnode = document.getElementsByClassName("surplus")[0];

    function render() {
      //渲染所有数据
      $.ajax({
        url: "/bill/api/getbill",
        type: "post",
        data: {
          uid: "5c343c924b7e859018e94c75"
        },
        dataType: "json",
        success: function success(response) {
          var str = '';

          if (response.code == 1) {
            var income = 0; //收入

            var expend = 0; //支出

            var surplus = 0;
            response.msg.forEach(function (item) {
              if (item.type == "收入") {
                income += item.money * 1;
              } else if (item.type == "支出") {
                expend += item.money * 1;
              }

              str += "<li class=\"mui-table-view-cell\">\n                        <div class=\"mui-slider-right mui-disabled\">\n                            <a class=\"mui-btn mui-btn-red\" data-id=".concat(item._id, ">\u5220\u9664</a>\n                        </div>\n                        <div class=\"mui-slider-handle\">\n                            <p>\n                                <i class=\"").concat(item.icon, "\" id=\"cycle\"></i>\n                            </p>\n                            <p>\n                                <span>").concat(item.cid, "</span>\n                                <span>").concat(item.timer, "</span>\n                            </p>\n                            <p class=").concat(item.type == "支出" ? "red" : "green", ">").concat(item.money, "</p>\n                        </div>\n                    </li>");
            });
            incomenode.innerHTML = income + '元'; //收入

            expendnode.innerHTML = expend + '元'; //支出

            surplusnode.innerHTML = income - expend + '元'; //结余

            ullist.innerHTML = str;
          }
        }
      });
    }

    function removelist() {
      //删除
      var btnArray = ['确认', '取消'];
      mui('#OA_task_1').on('tap', '.mui-btn', function (event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        var id = event.target.getAttribute("data-id");
        mui.confirm('确认删除该条记录？', 'Hello', btnArray, function (e) {
          if (e.index == 0) {
            li.parentNode.removeChild(li);
            $.ajax({
              url: "/bill/api/removebill",
              type: "post",
              data: {
                _id: id
              },
              //把id传入后台删除
              success: function success(data) {
                if (data.code == 1) {
                  window.location.reload(); //删除后重新加载
                }
              }
            });
          } else {
            setTimeout(function () {
              mui.swipeoutClose(li);
            }, 0);
          }
        });
      });
    }

    document.getElementById("add").addEventListener("tap", function () {
      //跳转新增账单页面
      location.href = "addbill.html";
    });
    var selectdata = document.getElementById("selectdata"); //年月

    var newdata = document.getElementById("newdata"); //日期 

    var curYear = new Date().getFullYear(),
        //获取当前年
    curMonth = new Date().getMonth() + 1; //获取当前月

    var curmonth = curMonth < 10 ? '0' + curMonth : curMonth; //加零函数

    selectdata.innerHTML = "月"; //初始默认月

    newdata.innerHTML = curYear + '-' + curmonth; //初始当前年月

    var dtpickerY = new mui.DtPicker({
      type: "month" //设置日历初始视图模式  

    });
    var dtpickerN = new mui.DtPicker({
      type: "year" //设置日历初始视图模式  

    });
    var picker = new mui.PopPicker();
    picker.setData([{
      value: 'year',
      text: '年'
    }, {
      value: 'month',
      text: '月'
    }]); //下拉框的内容

    selectdata.addEventListener("tap", function () {
      //设置年月下拉，以及设置选中的内容 
      picker.show(function (e) {
        selectdata.innerHTML = e[0].text; //设置年或者月的内容

        if (selectdata.innerHTML === "月") {
          //如果当前选择的是月，则显示年月的下拉框 
          dtpickerY.show(function (e) {
            newdata.innerHTML = e.y.text + '-' + e.m.text; //显示年月
          });
        } else if (selectdata.innerHTML === "年") {
          //如果当前选择的是年，则显示年的下拉框
          dtpickerN.show(function (e) {
            newdata.innerHTML = e.y.text;
          });
        }
      });
    });
    newdata.addEventListener("tap", function () {
      //第二个按钮点击，直接读取年月
      dtpickerY.show(function (e) {
        newdata.innerHTML = e.y.text + '-' + e.m.text; //显示年月
      });
    });
  });
});