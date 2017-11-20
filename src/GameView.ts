var betBtnListConfig = [
    {
        name: 'shizi',
        times: 'x15',
        default: 'game_c1_png',
        active: 'game_c1_active_png'
    },
    {
        name: 'houzi',
        times: 'x10',
        default: 'game_c2_png',
        active: 'game_c2_active_png'
    },
    {
        name: 'banma',
        times: 'x6',
        default: 'game_c3_png',
        active: 'game_c3_active_png'
    },
    {
        name: 'luotuo',
        times: 'x6',
        default: 'game_c4_png',
        active: 'game_c4_active_png'
    },
    {
        name: 'tuoniao',
        times: 'x4',
        default: 'game_c5_png',
        active: 'game_c5_active_png'
    },
    {
        name: 'yezhu',
        times: 'x4',
        default: 'game_c6_png',
        active: 'game_c6_active_png'
    }
]

function mapWithIndex(arr, merge) {
    return arr.map((item, index) => {
        return {
            ...item,
            ...merge,
            index: `${index}`
        }
    })
}

class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    private roles: egret.MovieClip[] = []
    private betBtnList: eui.List
    private totalCoin: eui.Label

    public childrenCreated() {
        super.createChildren()
        var roleConfig = RES.getRes('role_json')
        roleConfig.forEach((item, index) => {
            var mcData = RES.getRes(item.data)
            var mcTexture = RES.getRes(item.texture)
            var mcFactory = new egret.MovieClipDataFactory(mcData, mcTexture)
            this.roles[index] = new egret.MovieClip(mcFactory.generateMovieClipData('run'))
            this.roles[index].x = item.x
            this.roles[index].y = item.y
            // this.roles[index].gotoAndPlay(1, -1)
            this.addChild(this.roles[index])
        })

        let betBtnCollection = new eui.ArrayCollection(mapWithIndex(betBtnListConfig, {
            amount: 0,
            state: 'default'
        }))
        this.betBtnList.dataProvider = betBtnCollection
        this.betBtnList.addEventListener('touchTap', function(e) {
            console.log(typeof e.target.name)
            if (e.target.name) {
                var index = parseInt(e.target.name)
                var collItem = betBtnCollection.getItemAt(index)
                betBtnCollection.replaceItemAt({
                    ...collItem,
                    state: 'active'
                }, index)
            }
        }, this)
    }

}