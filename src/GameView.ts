class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    private c1:eui.Image

    public childrenCreated(){
        var mcData = RES.getRes('ani_c1_json')
        var mcTexture = RES.getRes('ani_c1_png')
        var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture)
        var role:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData('run'))
        this.addChild(role)
        role.gotoAndPlay(1, 5)
        role.x = 100
        role.y = 100
        
	}

}