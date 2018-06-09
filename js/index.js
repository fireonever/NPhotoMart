"use strict";
    var dappContactAddress = "n1mZZWiKEkJgm3JoQcwXkHXJYGdCMRZ5ZZ5";
    var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
    var NebPay = require("nebpay");
    var nebPay = new NebPay();
    var serialNumber;

    var from = dappContactAddress;
    var value = "0";
    var nonce = "0"
    var gas_price = "1000000"
    var gas_limit = "2000000"
    var callFunction = "";
    var callArgs = "[\""+"\"]";



$(function(){
	
    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");


});


function init(){

	callFunction = "getAllPhotos";
	var contract = {
        "function": callFunction,
        "args": callArgs
    };

    //$("#index-body").append("<div class=\"mdui-container mdui-p-t-5\">		  <div class=\"mdui-progress\">		    <div class=\"mdui-progress-indeterminate\"></div>		  </div>		</div>");
	neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        var result = resp.result;

        if (result === 'null') {
            return;
        }

        var photos = JSON.parse(result);

        for (var i = 0; i <photos.length; ++i) {
            var file = AV.File.withURL('resume.png', photos[i].url);
			console.log(file.thumbnailURL(300, 188));
			
			$('.mdui-grid-list').append("<div class=\"mdui-col\"><div class=\"mdui-card\"><div class=\"mdui-card-media\"><img src=\"" + file.thumbnailURL(450, 300) + "\"/>                  </div>                  <div class=\"mdui-chip\" style=\"margin:5px;\">                  <span class=\"mdui-chip-icon\"><i class=\"mdui-icon material-icons\">attach_money</i></span>                  <span class=\"mdui-chip-title\">" + photos[i].price + "Nas</span>                </div>                  <div class=\"mdui-card-actions \">                    <a class=\"mdui-btn mdui-btn-block mdui-color-indigo mdui-ripple \" href=\"detail.html?id=" + photos[i].id + "\">查看详情</a>                  </div>                </div>            </div>");
        }


	    }).catch(function (err) {
	        console.log("error :" + err.message);
	    })
}



 $("#fileUpload").on('change', function () {

        if (typeof (FileReader) != "undefined") {

            var image_holder = $("#image-holder");
            image_holder.empty();

            var reader = new FileReader();
            reader.onload = function (e) {
                $("<img />", {
                    "src": e.target.result,
                    "class": "thumb-image",
                    "style": "max-width:90%"
                }).appendTo(image_holder);

            }
            image_holder.show();
            reader.readAsDataURL($(this)[0].files[0]);
        } else {
            alert("你的浏览器不支持FileReader.");
        }
});

$('#upload_photo_btn').click(function() {
        var image_holder_tmp = $("#image-holder img");
        var image_holder = $("#image-holder img")[0];
        var data = { base64: image_holder.src};
        var file = new AV.File('nabulas.png', data);
        var image_id = SHA1(image_holder.src);
        var price = $(".upload-price").val();
        $(".upload-id").text(image_id);

        if($('.upload-price').val() == "" || isNaN($('.upload-price').val())) {
            alert("请正确填写价格");
            return;
        }

        callFunction = "registerPhoto"
        var to = dappContactAddress;
        var value = "0";


        file.save().then(function(file) {
            // 文件保存成功
            callArgs = "[\""+ image_id +"\",\"" + file.url() + "\",\"" + price + "\"]";
            serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
                listener: function (resp) {
                    alert("上传成功");
                    console.log("thecallback is " + resp)
                }
            });
        }, function(error) {
            // 异常处理
            console.error(error);
        });
    });
