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
        _this.skinName = 'resource/skins/GameView.exml';
        return _this;
    }
    GameView.prototype.childrenCreated = function () {
        var mcData = RES.getRes('ani_c1_json');
        var mcTexture = RES.getRes('ani_c1_png');
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
        var role = new egret.MovieClip(mcDataFactory.generateMovieClipData('run'));
        this.addChild(role);
        role.gotoAndPlay(1, 5);
        role.x = 100;
        role.y = 100;
    };
    return GameView;
}(eui.Component));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map