class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    private c1:eui.Image

    public childrenCreated(){
        // console.log(this.c1)
        this.c1.source = 'game_c1_active_png'
	}

}