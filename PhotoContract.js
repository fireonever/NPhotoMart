'use strict'


var Photo = function (args) {
    if(args) {
        var data = JSON.parse(args);
        this.id = data.id;  //图片ID，SHA1码，是惟一的
        this.url = data.url;
        this.author = data.author;  //作者钱包地址
        this.datetime = data.datetime;  //登记时间
        this.price = new BigNumber(data.price); //价格
    }
};

Photo.prototype = {
    toString : function () {
        return JSON.stringify(this);
    }
};


var Order = function (args) {
    if(args) {
        var data = JSON.parse(args);
        this.orderId = new BigNumber(data.orderId);                                 //订单ID
        this.photoId = data.photoId;                                 //图片ID，SHA1码，是惟一的
        this.createrAddress = data.createrAddress;                //购买者钱包地址
        this.createTime = data.createTime;                             //创建时间
        this.payTime = data.payTime;                                //支付时间
        this.amount = new BigNumber(data.amount);                   //金额
        this.photoUrl = data.photoUrl;
        this.payStatus = data.payStatus;
    }
};

Order.prototype = {
    toString : function () {
        return JSON.stringify(this);
    }
};

var PhotoContract = function () {
    LocalContractStorage.defineMapProperty(this, "dataMap",{
        parse : function (args) {
            return new Photo(args);
        },
        stringify : function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineMapProperty(this, "arryMap");
    LocalContractStorage.defineMapProperty(this, "orderDataMap",{
        parse : function (args) {
            return new Order(args);
        },
        stringify : function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "count");
    LocalContractStorage.defineProperty(this, "orderCount");
};

PhotoContract.prototype = {
    init:function () {
        this.count = 0;
        this.orderCount = 0;
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

    getAllPhotos : function() {
        var photos = [];
        for (var i = 0; i < this.count; ++i) {
            var id = this.arryMap.get(i);
            var obj = JSON.parse(this.dataMap.get(id));
            photos.push(obj);
        }
        return photos;
    },

    registerPhoto : function (_id,_url,_price) {
        if(!_id || !_price) {
            throw new Error("Invalid args data")
        }

        var photo = new Photo();
        photo.id = _id;
        photo.url = _url;
        photo.author = Blockchain.transaction.from;
        photo.datetime = this.getNowTime();
        photo.price = new BigNumber(_price);

        if (this.getPhoto(_id) === null){
            this.dataMap.put(_id,photo);
            this.arryMap.put(this.count,_id);
            this.count += 1;
            return true;
        }
        return false;
    },

    //order content
    getAllOrders : function() {
        var orders = [];
        var from = Blockchain.transaction.from;
        for (var i = 0; i < this.orderCount; ++i) {
            var order = this.orderDataMap.get(i);
            if (order.createrAddress === from) {
                var obj = JSON.parse(this.orderDataMap.get(i));
                orders.push(obj);
            }
        }
        return orders;
    },

    getOrder : function(_orderId) {
        if(!_orderId) {
            throw new Error("Invalid arguments")
        }
        return this.orderDataMap.get(_orderId);
    },

    submitOrder : function (_photoId) {
        if(!_photoId) {
            throw new Error("Invalid args data")
        }

        var photo = this.getPhoto(_photoId);
        if (photo === null) {
            return false;
        }

        var order = new Order();

        order.orderId = new BigNumber(this.orderCount);
        order.photoId = _photoId;
        order.createrAddress = Blockchain.transaction.from;
        order.createTime = this.getNowTime();
        order.photoUrl = photo.url;
        order.amount = new BigNumber(photo.price);
        order.payStatus = 0;
        this.orderDataMap.put(this.orderCount,order);
        this.orderCount += 1;
        return true;
    },

    payforOrder : function(_orderId) {
        var order = this.getOrder(_orderId);

        if (order === null) {
            return "订单不存在";
        }

        var photoId = order.photoId;
        var photo = this.getPhoto(photoId);

        var value = new BigNumber(Blockchain.transaction.value);
        var orderValue = new BigNumber(order.amount * 1000000000000000000);

        order.payStatus = 1;
        order.payTime = this.getNowTime();
        this.orderDataMap.set(order.orderId,order);

        var result = Blockchain.transfer("n1GDCCpQ2Z97o9vei2ajq6frrTPyLNCbnt7",value);//photo.author,value);

        /*if (value != (order.amount * 1000000000000000000)) {

            order.payStatus = 1;
            order.payTime = this.getNowTime();
            this.orderDataMap.set(order.orderId,order);

           //transfer
            var result = Blockchain.transfer("n1GDCCpQ2Z97o9vei2ajq6frrTPyLNCbnt7",value);//photo.author,value);
            return result;
        }*/
    },

}

module.exports = PhotoContract;
