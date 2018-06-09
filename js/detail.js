var photoId;



function getPhotoId() {
	var url = window.location.search;   //location.search是从当前URL的?号开始的字符串  
	var args = url .split("?id=");
  
    return args[1];
}


function getPhotoDetail() {
	photoId = getPhotoId();
	callArgs = "[\""+ photoId + "\"]";

	callFunction = "getPhoto";
	var contract = {
        "function": callFunction,
        "args": callArgs
    };

	neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
		var result = resp.result;

        if (result === 'null') {
            return;
        }

        var photo = JSON.parse(result);

        $("#detail_image").attr("src",photo.url);

        $($("#photo-detail-right").find("span").get(0)).text("作者：" + photo.author);
        $($("#photo-detail-right").find("span").get(1)).text("价格：" + photo.price + "Nas");
        $($("#photo-detail-right").find("span").get(2)).text("上传时间：" + photo.datetime);
        $($("#photo-detail-right").find("span").get(3)).text("图片(SHA1)");
        $($("#photo-detail-right").find("span").get(4)).text(photo.id);

	    }).catch(function (err) {
	        console.log("error :" + err.message);
	    })
}

$("#add_to_cart_btn").click(function(){
    callArgs = "[\""+ photoId + "\"]";

    callFunction = "submitOrder";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };

    serialNumber = nebPay.call(dappContactAddress, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: function (resp) {
            var inst = new mdui.Dialog('#add_to_cart_dlg');
            inst.open();
        }
    })
})


