var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function mapWithIndex(arr, merge) {
    return arr.map(function (item, index) {
        return __assign({}, item, merge, { index: "" + index });
    });
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var BET_AMOUNT = [1, 10, 20, 50, 100];
var INIT_BET_AMOUNT = 50;
var INIT_TOTAL_COIN = 1000;
var MAX_BET_COIN = 100;
var GAME_TIME = 5000;
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        var _this = _super.call(this) || this;
        // 游戏对象
        _this.roles = [];
        // 游戏数据
        _this.betBtnListConfig = [];
        _this.roleConfig = [];
        _this.isGameRunning = false;
        _this.isMapMoved = false;
        _this.isMapEnd = false;
        _this.userBetData = [];
        _this.totalCoin = INIT_TOTAL_COIN;
        _this.betCoin = INIT_BET_AMOUNT;
        _this.nextTimer = null;
        _this.skinName = 'resource/skins/GameView.exml';
        return _this;
    }
    GameView.prototype.childrenCreated = function () {
        _super.prototype.createChildren.call(this);
        this.initRoles();
        this.initBetBtns();
        // 初始化文字显示
        this.totalCoinLabel.text = String(this.totalCoin);
        this.betCoinLabel.text = String(this.betCoin);
        // 绑定组件事件
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.startBtn.addEventListener('touchTap', this.onClickStartBtn, this);
        this.betMinusBtn.addEventListener('touchTap', this.onClickBetMinusBtn, this);
        this.betPlusBtn.addEventListener('touchTap', this.onClickBetPlusBtn, this);
        this.betCancelBtn.addEventListener('touchTap', this.onClickBetCancelBtn, this);
        this.rebetBtn.addEventListener('touchTap', this.onClickRebetBtn, this);
    };
    GameView.prototype.initRoles = function () {
        var _this = this;
        this.roleConfig = RES.getRes('role_json');
        this.roleConfig.forEach(function (item, index) {
            var mcData = RES.getRes(item.data);
            var mcTexture = RES.getRes(item.texture);
            var mcFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
            _this.roles[index] = new egret.MovieClip(mcFactory.generateMovieClipData('run'));
            _this.roles[index].x = item.x;
            _this.roles[index].y = item.y;
            _this.addChild(_this.roles[index]);
        });
    };
    GameView.prototype.initBetBtns = function () {
        this.betBtnListConfig = RES.getRes('bet_json');
        this.betBtnCollection = new eui.ArrayCollection(this.betBtnListConfig.slice());
        this.betBtnList.dataProvider = this.betBtnCollection;
        this.betBtnList.addEventListener('touchTap', this.onClickBetBtn, this);
    };
    GameView.prototype.rolesDash = function () {
        // 第一次动物跑到屏幕中间
        if (!this.isMapMoved) {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item);
                tw.to({
                    x: this.stage.stageWidth / 2 + getRandomInt(-50, 50)
                }, 1000).call(this.onRoleTwComplete.bind(this, index));
            }, this);
        }
        else if (!this.isMapEnd) {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item);
                tw.to({
                    x: item.x + getRandomInt(-100, 100)
                }, 1000).call(this.onRoleTwComplete.bind(this, index));
            }, this);
        }
        else {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item);
                var randomX = getRandomInt(-100, 100);
                var nextX = 150 + randomX;
                if (nextX > item.x) {
                    nextX = 150 + getRandomInt(-100, -50);
                }
                tw.to({
                    x: 150 + getRandomInt(-100, 100)
                }, 1000).call(this.onRoleTwComplete.bind(this, index));
            }, this);
        }
        this.rolesTimer.stop();
    };
    GameView.prototype.onRoleTwComplete = function (index) {
        var _this = this;
        // only want to call once
        if (index !== 0) {
            return;
        }
        if (!this.isMapMoved) {
            this.isMapMoved = true;
            var tw = egret.Tween.get(this.gameMap);
            tw.to({
                x: 0
            }, GAME_TIME).call(function () {
                _this.isMapEnd = true;
                egret.clearTimeout(_this.nextTimer);
                _this.rolesDash();
            });
        }
        var delay = this.isMapEnd ? 200 : 1000;
        this.nextTimer = egret.setTimeout(function () {
            if (!this.rolesTimer.running && this.isGameRunning) {
                this.rolesTimer.start();
            }
        }, this, delay);
    };
    GameView.prototype.onClickBetBtn = function (e) {
        if (e.target.name) {
            var index = parseInt(e.target.name);
            var collItem = this.betBtnCollection.getItemAt(index);
            var nextAmount = this.getNextBetAmount(collItem.amount);
            var diffAmount = nextAmount - collItem.amount;
            this.totalCoin -= diffAmount;
            this.totalCoinLabel.text = String(this.totalCoin);
            this.betBtnCollection.replaceItemAt(__assign({}, collItem, { amount: nextAmount }), index);
        }
    };
    GameView.prototype.getNextBetAmount = function (a) {
        if (a + this.betCoin <= MAX_BET_COIN) {
            return a + this.betCoin;
        }
        return MAX_BET_COIN;
    };
    GameView.prototype.onEnterFrame = function () {
        var _this = this;
        if (this.isGameRunning) {
            var hasWinRole = false;
            var winRolesX = [];
            this.roles.forEach(function (item, index) {
                if (item.x < 150) {
                    hasWinRole = true;
                }
                winRolesX.push(item.x);
            }, this);
            if (hasWinRole) {
                this.betTopMask.fillAlpha = 0;
                this.betPanelMask.fillAlpha = 0;
                this.isGameRunning = false;
                this.roles.forEach(function (item) {
                    item.stop();
                    egret.Tween.removeTweens(item);
                }, this);
                var winX = Math.min.apply(null, winRolesX);
                var winIndex_1 = winRolesX.indexOf(winX);
                this.roles.forEach(function (item, index) {
                    if (index === winIndex_1) {
                        // 更换冠军图片
                        var collItem = _this.betBtnCollection.getItemAt(index);
                        _this.betBtnCollection.replaceItemAt(__assign({}, collItem, { resource: collItem.active }), index);
                        var tw = egret.Tween.get(item);
                        tw
                            .wait(500)
                            .to({ alpha: 0 }).wait(500)
                            .to({ alpha: 1 }).wait(500)
                            .to({ alpha: 0 }).wait(500)
                            .to({ alpha: 1 }).wait(500)
                            .call(function () {
                            egret.Tween.removeTweens(item);
                            // 计算输赢金币
                            var winCoin = 0;
                            _this.userBetData.forEach(function (bet, index) {
                                if (index === winIndex_1) {
                                    winCoin += bet.amount * bet.times;
                                }
                            });
                            _this.totalCoin += winCoin;
                            _this.totalCoinLabel.text = String(_this.totalCoin);
                            _this.roles.forEach(function (item) {
                                item.visible = false;
                            });
                            var tw = egret.Tween.get(_this.gameMap);
                            tw.to({
                                x: -1920
                            }, 500).call(function () {
                                _this.roleConfig.forEach(function (item, index) {
                                    _this.roles[index].x = item.x;
                                    _this.roles[index].visible = true;
                                });
                                _this.isMapMoved = false;
                                _this.isMapEnd = false;
                                _this.startBtn.visible = true;
                                _this.betBtnCollection.replaceAll(_this.betBtnListConfig.slice());
                            });
                            _this.betTopMask.fillAlpha = 0.5;
                            _this.betPanelMask.fillAlpha = 0.5;
                            _this.betTopMask.visible = false;
                            _this.betPanelMask.visible = false;
                        }, _this);
                    }
                }, this);
            }
        }
    };
    GameView.prototype.onClickStartBtn = function () {
        this.betTopMask.visible = true;
        this.betPanelMask.visible = true;
        this.startBtn.visible = false;
        this.isGameRunning = true;
        this.userBetData = this.betBtnCollection.source.slice();
        this.roles.forEach(function (item) {
            item.gotoAndPlay(1, -1);
        });
        this.rolesTimer = new egret.Timer(1000, -1);
        this.rolesTimer.addEventListener('timer', this.rolesDash, this);
        this.rolesTimer.start();
        this.rolesDash();
    };
    GameView.prototype.onClickBetMinusBtn = function () {
        var i = BET_AMOUNT.indexOf(this.betCoin);
        if (typeof BET_AMOUNT[i - 1] !== 'undefined') {
            this.betCoin = BET_AMOUNT[i - 1];
        }
        else {
            this.betCoin = BET_AMOUNT[BET_AMOUNT.length - 1];
        }
        this.betCoinLabel.text = String(this.betCoin);
    };
    GameView.prototype.onClickBetPlusBtn = function () {
        var i = BET_AMOUNT.indexOf(this.betCoin);
        if (typeof BET_AMOUNT[i + 1] !== 'undefined') {
            this.betCoin = BET_AMOUNT[i + 1];
        }
        else {
            this.betCoin = BET_AMOUNT[0];
        }
        this.betCoinLabel.text = String(this.betCoin);
    };
    GameView.prototype.onClickBetCancelBtn = function () {
        this.betBtnCollection.replaceAll(this.betBtnListConfig.slice());
    };
    GameView.prototype.onClickRebetBtn = function () {
        if (this.userBetData.length) {
            this.betBtnCollection.replaceAll(this.userBetData.slice());
        }
    };
    return GameView;
}(eui.Component));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map