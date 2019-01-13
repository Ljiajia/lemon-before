"use strict";

require(["./config"], function () {
  require(["muimin", "swiper", "picker"], function (muimin, Swiper, picker) {
    mui.init();
    var sswiper = new Swiper("#swiper", {
      pagination: {
        el: '#paginationone'
      }
    }); //第一个swiper

    var swipertwo = new Swiper("#swipertwo", {
      pagination: {
        el: '#paginationtwo'
      }
    }); //第二个swiper

    var swiperthree = new Swiper("#swiperthree", {
      pagination: {
        el: '#paginationthree'
      }
    });
    var headullist = document.querySelector(".headullist"); //头部tab切换的

    var sectionullist = document.querySelector(".section-ullist");
    var tabs_li = headullist.children; //头部切换的三个按钮

    var section_li = sectionullist.children; //主体的子节点---tab切换使用的

    var footlist = document.querySelector(".foot-ollist"); //获取尾部计算器的父元素

    var money = document.getElementById("money"); //获取金额  

    var swiperslide = document.getElementsByClassName("swiperslide");
    var achieve = document.getElementsByClassName("achieve")[0]; //完成

    var back = document.getElementsByClassName("mui-icon-back")[0]; //返回

    var nowdata = document.getElementsByClassName("nowdata"); //获取日期调用插件使用

    var clock = document.getElementsByClassName("clock"); //更改当前日期使用

    var oneslide = document.getElementById("oneslide"); // 

    var twoslide = document.getElementById("twoslide"); //  

    var threeslide = document.getElementById("threeslide"); //  

    var container = document.getElementById("container"); // 

    var addclassify = document.getElementsByClassName("addclassify")[0]; //新增

    var uid = "5c343c924b7e859018e94c75"; //用户id

    var moneytype = "支出"; //初始化默认支出

    var icon = '';
    var cid = "默认";
    init(); //初始化所有事件

    var newdata = new Date().toLocaleString().split(" ")[0].split("/"); //获取当前时间

    newdata[1] < 0 ? "0" + newdata[1] : newdata[1]; //加零函数

    for (var i = 0; i < clock.length; i++) {
      clock[i].innerHTML = newdata[1] + '月' + newdata[2] + '日';
      var timer = clock[i].innerHTML;
    }

    function init() {
      renderIcon(); //渲染icon

      tab(); //tab切换

      ounter(); //计算器

      addEvent(); //点击跳回首页

      selectIcon(); //选择icon
    }

    var picker = new mui.PopPicker();
    var dtPickerM = new mui.DtPicker({
      type: "date"
    }); //传参data    可以选择  年月日

    function dtPickerShow(dtPicker, type) {
      //设置选择的年月
      dtPicker.show(function (e) {
        if (moneytype == "支出") {
          var nowmonth = e.m.text;
          var nowdate = e.d.text;
          clock[0].innerHTML = nowmonth + '月' + nowdate + '日';
        } else if (moneytype == "收入") {
          var nowmonth2 = e.m.text;
          var nowdate2 = e.d.text;
          clock[1].innerHTML = nowmonth2 + '月' + nowdate2 + '日';
        }
      });
    }

    function tab() {
      var _loop = function _loop(_i) {
        tabs_li[_i].onclick = function () {
          moneytype = tabs_li[_i].innerHTML; //获取当前页面是支出还是收入还是转账

          section_li[_i].style.display = "block";

          tabs_li[_i].classList.add("cur");
        };
      };

      //tab切换
      for (var _i = 0; _i < tabs_li.length; _i++) {
        _loop(_i);
      }
    }

    function ounter() {
      //计算器
      mui(footlist).on("tap", "span", function () {
        if (this.innerText == "x") {
          //判断点击的是x
          if (money.value == "0.00") {
            //如果金额内容为0.00，那就不删除
            money.value = "0.00";
          } else {
            money.value = money.value.substr(0, money.value.length - 1); //否则每次删除一位
          }
        } else if (money.value == "0.00") {
          //如果金额为初始的0.00，就把计算器输入的值赋给总金额
          money.value = this.innerText;
        } else if (money.value.indexOf(".") != -1 && this.value == ".") {
          //设置只能输入以为小数点
          money.value = money.value;
        } else if (money.value.indexOf(".") != -1 && money.value.split(".")[1].length == "2") {
          //保留小数点后2位
          money.value = money.value;
        } else {
          money.value += this.innerText;
        }
      });
    }

    ;

    function selectIcon() {
      //选择icon
      mui(swiperslide).on("tap", "dl", function () {
        //选择icon的时候获取到需要传的参数
        for (var _i2 = 0; _i2 < swiperslide.length; _i2++) {
          //排他法，让其他的dl>dt 不添加cur类名
          for (var j = 0; j < swiperslide[_i2].children.length; j++) {
            swiperslide[_i2].children[j].firstElementChild.classList.remove("cur");
          }
        }

        var iconnode = this.firstElementChild.classList.add("cur"); //给当前点击的添加类

        icon = this.firstElementChild.firstElementChild.className; //获取icon

        cid = this.lastElementChild.innerHTML; //获取说明

        console.log(moneytype);

        if (icon == "mui-icon mui-icon-plusempty") {
          //判断如果点击的是添加按钮，就跳转到添加到页面
          location.href = "iconlist.html?type=".concat(moneytype);
        }
      });
      achieve.addEventListener("tap", function () {
        //点击完成，发起ajax请求，把需要的参数传过去
        var moneys = money.value; //点击完成的时候，获取最后的金额

        if (moneytype == "支出") {
          timer = clock[0].innerHTML;
        } else if (moneytype == "收入") {
          timer = clock[1].innerHTML;
        } else if (moneytype == "转账") {
          timer = clock[2].innerHTML;
        }

        for (var j = 0; j < tabs_li.length; j++) {
          section_li[j].style.display = "none";
          tabs_li[j].classList.remove("cur");
        }

        if (moneys == "0.00") {
          alert("请输入正确的金额");
        } else {
          console.log(timer);
          addbill(uid, icon, moneytype, timer, moneys, cid);
        }
      });
    }

    function addEvent() {
      //放所有的点击事件
      back.addEventListener("tap", function () {
        //点击返回，跳回首页面
        window.location.href = "/";
      });
      mui(nowdata).on("tap", "span", function () {
        //点击的时候显示日期组件
        dtPickerShow(dtPickerM, "date");
      });
    }

    function addbill(uid, icon, moneytype, timer, moneys, cid) {
      //添加账单
      mui.ajax('/bill/api/addbill', {
        data: {
          uid: uid,
          icon: icon,
          type: moneytype,
          money: moneys,
          cid: cid,
          timer: timer
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
            alert("添加成功");
            location.href = "/";
          }
        }
      });
    }

    ;

    function renderIcon() {
      //渲染支出，收入，转账页面
      mui.ajax('/classify/api/findclassify', {
        dataType: 'json',
        //服务器返回json格式数据
        type: 'post',
        //HTTP请求类型 
        headers: {
          'Content-Type': 'application/json'
        },
        success: function success(data) {
          if (data.code == 1) {
            var onestr = '';
            var twostr = '';
            var threestr = '';
            var obj1 = false;
            var obj2 = false;
            var obj3 = false;
            data.msg.forEach(function (item, index) {
              var newclass = '';

              if (obj1 == false && item.type == "支出") {
                newclass = "cur";
                obj1 = true;
              }

              if (obj2 == false && item.type == "收入") {
                newclass = "cur";
                obj2 = true;
              }

              if (obj3 == false && item.type == "转账") {
                newclass = "cur";
                obj3 = true;
              }

              if (item.type == "支出") {
                onestr += "<dl><dd class=\"".concat(newclass, "\"><span class=\"").concat(item.icon, "\"></span></dd><dt>").concat(item.cid, "</dt></dl>");
              } else if (item.type == "收入") {
                twostr += "<dl><dd class=\"".concat(newclass, "\"><span class=\"").concat(item.icon, "\"></span></dd><dt>").concat(item.cid, "</dt></dl>");
              } else if (item.type == "转账") {
                threestr += "<dl><dd class=\"".concat(newclass, "\"><span class=\"").concat(item.icon, "\"></span></dd><dt>").concat(item.cid, "</dt></dl>");
              }

              ;
            });
            onestr += "<dl class=\"addclassify\"><dd><span class=\"mui-icon mui-icon-plusempty\"></span></dd><dt>\u65B0\u589E</dt></dl>";
            twostr += "<dl class=\"addclassify\"><dd><span class=\"mui-icon mui-icon-plusempty\"></span></dd><dt>\u65B0\u589E</dt></dl>";
            threestr += "<dl class=\"addclassify\"><dd><span class=\"mui-icon mui-icon-plusempty\"></span></dd><dt>\u65B0\u589E</dt></dl>";
            oneslide.innerHTML += onestr;
            twoslide.innerHTML = twostr;
            threeslide.innerHTML = threestr;
          }
        }
      });
    }
  });
});