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
var GameView = (function (_super) {
    __extends(GameView, _super);
    function GameView() {
        var _this = _super.call(this) || this;
        _this.roles = [];
        _this.skinName = 'resource/skins/GameView.exml';
        return _this;
    }
    GameView.prototype.childrenCreated = function () {
        var _this = this;
        console.log(this.stage.stageWidth);
        var roleConfig = RES.getRes('role_json');
        roleConfig.forEach(function (item, index) {
            var mcData = RES.getRes(item.data);
            var mcTexture = RES.getRes(item.texture);
            var mcFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
            _this.roles[index] = new egret.MovieClip(mcFactory.generateMovieClipData('run'));
            _this.roles[index].x = _this.stage.stageWidth - _this.roles[index].width - 20;
            _this.roles[index].y = item.y;
            _this.roles[index].gotoAndPlay(1, -1);
            _this.addChild(_this.roles[index]);
        });
    };
    return GameView;
}(eui.Component));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map