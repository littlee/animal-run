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
        this.bg = new eui.Image();
        this.bg.source = 'resource/assets/game_lane.jpg';
        this.bg.x = 0;
        this.bg.y = 0;
        this.bg.width = this.stage.stageWidth * 2;
        this.addChild(this.bg);
        this.bg.addEventListener('touchTap', function () {
            this.bg.x += 10;
        }, this);
    };
    return GameView;
}(eui.Component));
__reflect(GameView.prototype, "GameView");
//# sourceMappingURL=GameView.js.map