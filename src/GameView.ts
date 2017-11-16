class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    private bg:eui.Image

    public childrenCreated(){
        this.bg = new eui.Image()
        this.bg.source = 'resource/assets/game_lane.jpg'
        this.bg.x = 0
        this.bg.y = 0
        this.bg.width = this.stage.stageWidth * 2
        this.addChild(this.bg)

        this.bg.addEventListener('touchTap', function() {
            this.bg.x += 10
        }, this)
	}

}