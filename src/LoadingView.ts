class LoadingView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/LoadingView.exml'
    }

    private loading:egret.tween.TweenGroup

    public childrenCreated(){
        this.loading.play()
	}
}