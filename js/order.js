var orders;
var count = 0;

function init(){
	alert(dappContactAddress);
}

function getAllOrders(){
	callArgs = "[\" + \"]";

    callFunction = "getAllOrders";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };

    window.postMessage({
        "target": "contentscript",
        "data": {},
        "method": "getAccount",
    }, "*");

    window.addEventListener('message', function (e) {
        if (e.data && e.data.data) {
            if (e.data.data.account) {
                from = e.data.data.account;
                neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
                    var result = resp.result;
                    if (result === 'null') {
                        return;
                    }
                    orders = JSON.parse(result);

                    if(count >= orders.length) return;

                    for (var i = 0; i < orders.length; ++i) {
                        var order = orders[i];
                        count++;

                        var payTime = order.payTime
                        if (order.payTime == null) {
                            payTime = "未支付";
                        }
                        var html = "<li class=\"mdui-list-item mdui-ripple order-list-item\">\n" +
                            "\t\t\t\t  \t<div class=\"mdui-card\" style=\"width: 100%;\">\n" +
                            "\t\t\t\t\t        <div class=\"mdui-col-sm-2 mdui-col-md-2\">\n" +
                            "\t\t\t\t\t\t        <a href=\"detail.html?id=" + order.photoId + "\"><img src=\"" + order.photoUrl + "\"/></a>\n" +
                            "\t\t\t\t\t\t    </div>\n" +
                            "\t\t\t\t\t\t    <div class=\"mdui-col-sm-5 mdui-col-md-5\">\n" +
                            "\t\t\t\t\t\t        <p>\n" +
                            "\t\t\t\t\t\t\t\t  <span class=\"order-photo-id\">图片(SHA1)：" + order.photoId + "</span>\n" +
                            "\t\t\t\t\t\t      \t</p>\n" +
                            "\t\t\t\t\t\t      \t<div class=\"mdui-divider\"></div>\n" +
                            "\t\t\t\t\t\t      \t<p>\n" +
                            "\t\t\t\t\t\t\t\t  <span>价格：" + order.amount + "Nas</span>\n" +
                            "\t\t\t\t\t\t      \t</p>\n" +
                            "\t\t\t\t\t\t      \t<div class=\"mdui-divider\"></div>\n" +
                            "\t\t\t\t\t\t    </div>\n" +
                            "\t\t\t\t\t\t    <div class=\"mdui-col-sm-3 mdui-col-md-3\">\n" +
                            "\t\t\t\t\t\t        <p>\n" +
                            "\t\t\t\t\t\t\t\t  <span>创建时间：" + order.createTime + "</span>\n" +
                            "\t\t\t\t\t\t      \t</p>\n" +
                            "\t\t\t\t\t\t      \t<div class=\"mdui-divider\"></div>\n" +
                            "\t\t\t\t\t\t      \t<p>\n" +
                            "\t\t\t\t\t\t\t\t  <span>支付时间：" + payTime + "</span>\n" +
                            "\t\t\t\t\t\t      \t</p>\n" +
                            "\t\t\t\t\t\t      \t<div class=\"mdui-divider\"></div>\n" +
                            "\t\t\t\t\t\t    </div>\n" +
                            "\t\t\t\t\t\t    <div class=\"mdui-col-sm-2 mdui-col-md-2\">\n" +
                            "\t\t\t\t\t\t    \t<div class=\"mdui-col add_to_cart\">";
                        if(order.payTime == null) {
                            html += "<button onclick=\"payForOrder("+order.orderId +"\,"+ order.amount+")\" class=\"mdui-btn mdui-btn-block mdui-color-green mdui-ripple\" id=\"pay_order_btn\" style=\"margin-bottom:8px;\">支付</button>";
                        }
                        html += "</div>\n" +
                            "\t\t\t\t\t\t    </div>\n" +
                            "\t\t\t\t\n" +
                            "\t\t\t      </div>\n" +
                            "\t\t\t\t  </li>"
                        $("#order-list").append(html);
                    }

                }).catch(function (err) {
                    console.log("error :" + err.message);
                })
            }
        }
    })

};


function payForOrder(orderId,amount){
    callArgs = "[\""+ orderId + "\"]";

    callFunction = "payforOrder";
    var contract = {
        "function": callFunction,
        "args": callArgs
    };

    value = amount;

    serialNumber = nebPay.call(dappContactAddress, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
        listener: function (resp) {

        }
    })
}