'use strict'


var Order = function (args) {
    if(args) {
        var data = JSON.parse(args);
        this.orderId = data.orderId;                                 //订单ID
        this.photoId = data.photoId;                                 //图片ID，SHA1码，是惟一的
        this.photoUrl = data.photoUrl;      //图片地址
        this.createrAddress = data.createrAddress;                //购买者钱包地址
        this.createTime = data.createTime;                             //创建时间
        this.payTime = data.payTime;                                //支付时间
        this.amount = new BigNumber(data.amount);                   //金额
        this.payStatus = data.payStatus;
        this.authorAddress = data.authorAddress;
    }
};

Order.prototype = {
    toString : function () {
        return JSON.stringify(this);
    }
};


var OrderContract = function () {
    LocalContractStorage.defineMapProperty(this, "dataMap",{
        parse : function (args) {
            return new Photo(args);
        },
        stringify : function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "arryMap");
    LocalContractStorage.defineProperty(this, "count");
};

PhotoContract.prototype = {
    init:function () {
        this.count = 0;
    },

    getNowTime: function() {
        var now = new Date();

        var hour = now.getHours() + 8;
        hour = hour < 10 ? '0' + hour : hour;
        var minute = now.getMinutes();
        minute = minute < 10 ? '0'+ minute : minute;
        var seconds = now.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;
        return now.getFullYear() + "-" + (now.getMonth()+1) + "-" + now.getDate() + " " + hour + ":" + minute + ":" + seconds;
    },

    getPhoto : function (_id) {
        if(!_id) {
            throw new Error("Invalid arguments")
        }
        return this.dataMap.get(_id);
    },

    getAllOrders : function() {
        var orders = [];
        for (var i = 0; i < this.count; ++i) {
            var id = this.arryMap.get(i);
            var obj = JSON.parse(this.dataMap.get(id));
            photos.push(obj);
        }
        return photos;
    },

    submitOrder : function (_url,_price) {
        if(!_url || !_price) {
            throw new Error("Invalid args data")
        }

        var order = new Order();
        photo.id = _id;
        photo.url = _url;
        photo.author = Blockchain.transaction.from;
        photo.datetime = this.getNowTime();
        photo.price = new BigNumber(_price);

        if (this.getPhoto(_id) === null){
            this.dataMap.put(_id,order);
            //this.arryMap.put(this.count,_id);
            this.count += 1;
            return true;
        }
        return false;
    },

    payForOrder : function (_id) {
        if(!_id) {
            throw new Error("Invalid args data")
        }

        var order = this.getOrder(_id);

        if(order === null) {
            return "订单不存在";
        }

        photo.id = _id;
        photo.url = _url;
        photo.author = Blockchain.transaction.from;
        photo.datetime = this.getNowTime();
        photo.price = new BigNumber(_price);

        if (this.getPhoto(_id) === null){
            this.dataMap.put(_id,order);
            //this.arryMap.put(this.count,_id);
            this.count += 1;
            return true;
        }
        return false;
    }

}

module.exports = OrderContract;
