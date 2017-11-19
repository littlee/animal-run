class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }


    private roles: egret.MovieClip[] = []

    public childrenCreated() {
        console.log(this.stage.stageWidth)
        var roleConfig = RES.getRes('role_json')
        roleConfig.forEach((item, index) => {
            var mcData = RES.getRes(item.data)
            var mcTexture = RES.getRes(item.texture)
            var mcFactory = new egret.MovieClipDataFactory(mcData, mcTexture)
            this.roles[index] = new egret.MovieClip(mcFactory.generateMovieClipData('run'))
            this.roles[index].x = this.stage.stageWidth - this.roles[index].width - 20
            this.roles[index].y = item.y
            this.roles[index].gotoAndPlay(1, -1)
            this.addChild(this.roles[index])
        })
    }

}