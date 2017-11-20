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
var betBtnListConfig = [
    {
        name: 'shizi',
        times: 'x15',
        resource: 'game_c1_png',
        default: 'game_c1_png',
        active: 'game_c1_active_png'
    },
    {
        name: 'houzi',
        times: 'x10',
        resource: 'game_c2_png',
        default: 'game_c2_png',
        active: 'game_c2_active_png'
    },
    {
        name: 'banma',
        times: 'x6',
        resource: 'game_c3_png',
        default: 'game_c3_png',
        active: 'game_c3_active_png'
    },
    {
        name: 'luotuo',
        times: 'x6',
        resource: 'game_c4_png',
        default: 'game_c4_png',
        active: 'game_c4_active_png'
    },
    {
        name: 'tuoniao',
        times: 'x4',
        resource: 'game_c5_png',
        default: 'game_c5_png',
        active: 'game_c5_active_png'
    },
    {
        name: 'yezhu',
        times: 'x4',
        resource: 'game_c6_png',
        default: 'game_c6_png',
        active: 'game_c6_active_png'
    }
];
function mapWithIndex(arr, merge) {
    return arr.map(function (item, index) {
        return __assign({}, item, merge, { index: "" + index });
    });
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        var _this = _super.call(this) || this;
        _this.roles = [];
        _this.skinName = 'resource/skins/GameView.exml';
        return _this;
    }
    GameView.prototype.childrenCreated = function () {
        _super.prototype.createChildren.call(this);
        this.initRoles();
        this.initBetBtns();
        this.startBtn.addEventListener('touchTap', function () {
            this.gameMapTw.play();
            this.roles.forEach(function (item) {
                item.gotoAndPlay(1, -1);
            });
            this.rolesTimer = new egret.Timer(1000, -1);
            this.rolesTimer.addEventListener('timer', this.rolesDash, this);
            this.rolesTimer.start();
        }, this);
    };
    GameView.prototype.initRoles = function () {
        var _this = this;
        var roleConfig = RES.getRes('role_json');
        roleConfig.forEach(function (item, index) {
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
        var betBtnCollection = new eui.ArrayCollection(mapWithIndex(betBtnListConfig, {
            amount: 0,
            state: 'default'
        }));
        this.betBtnList.dataProvider = betBtnCollection;
        this.betBtnList.addEventListener('touchTap', function (e) {
            if (e.target.name) {
                var index = parseInt(e.target.name);
                var collItem = betBtnCollection.getItemAt(index);
                betBtnCollection.replaceItemAt(__assign({}, collItem, { amount: collItem.amount + parseInt(this.betCoin.text) }), index);
            }
        }, this);
    };
    GameView.prototype.rolesDash = function () {
        this.roles.forEach(function (item, index) {
            var tw = egret.Tween.get(item);
            tw.to({
                x: item.x - getRandomInt(0, 300)
            }, 1000).call(function () {
                this.onRoleTwComplete(index);
            }, this);
        }, this);
        this.rolesTimer.stop();
    };
    GameView.prototype.onRoleTwComplete = function (index) {
        // only want to call once
        if (index !== 0) {
            return;
        }
        var hasWin = false;
        var winX = [];
        this.roles.forEach(function (item) {
            if (item.x < 150) {
                hasWin = true;
            }
            winX.push(item.x);
        });
        if (hasWin) {
            var minWinX = Math.min.apply(null, winX);
            console.log(winX.indexOf(minWinX));
        }
        else {
            egret.setTimeout(function () {
                if (!this.rolesTimer.running) {
                    this.rolesTimer.start();
                }
            }, this, 1000);
        }
    };
    return GameView;
}(eui.Component));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map