class StartView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/StartView.exml'
    }

    private room:eui.Image
    private clickRoomCallback: Function

    public childrenCreated(){
        this.room.addEventListener('touchTap', function() {
            this.clickRoomCallback()
        }, this)
	}

    public onClickRoom(cb) {
        this.clickRoomCallback = cb
    }
}