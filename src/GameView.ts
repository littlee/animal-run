var betBtnListConfig = [
    {
        name: 'shizi',
        times: 'x15',
        resource: 'game_c1_png',
        default: 'game_c1_png',
        active: 'game_c1_active_png'
    },
    {
        name: 'houzi',
        times: 'x10',
        resource: 'game_c2_png',
        default: 'game_c2_png',
        active: 'game_c2_active_png'
    },
    {
        name: 'banma',
        times: 'x6',
        resource: 'game_c3_png',
        default: 'game_c3_png',
        active: 'game_c3_active_png'
    },
    {
        name: 'luotuo',
        times: 'x6',
        resource: 'game_c4_png',
        default: 'game_c4_png',
        active: 'game_c4_active_png'
    },
    {
        name: 'tuoniao',
        times: 'x4',
        resource: 'game_c5_png',
        default: 'game_c5_png',
        active: 'game_c5_active_png'
    },
    {
        name: 'yezhu',
        times: 'x4',
        resource: 'game_c6_png',
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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    private roles: egret.MovieClip[] = []
    private rolesTimer: egret.Timer
    private betBtnList: eui.List
    private totalCoin: eui.Label
    private betCoin: eui.Label
    private startBtn: eui.Image
    private gameMap: eui.Image
    private gameMapTw: egret.tween.TweenGroup

    public childrenCreated() {
        super.createChildren()

        this.initRoles()
        this.initBetBtns()


        this.startBtn.addEventListener('touchTap', function () {
            this.gameMapTw.play()
            this.roles.forEach((item) => {
                item.gotoAndPlay(1, -1)
            })

            this.rolesTimer = new egret.Timer(1000, -1)
            this.rolesTimer.addEventListener('timer', this.rolesDash, this)
            this.rolesTimer.start()
        }, this)
    }

    private initRoles(): void {
        var roleConfig = RES.getRes('role_json')
        roleConfig.forEach((item, index) => {
            var mcData = RES.getRes(item.data)
            var mcTexture = RES.getRes(item.texture)
            var mcFactory = new egret.MovieClipDataFactory(mcData, mcTexture)
            this.roles[index] = new egret.MovieClip(mcFactory.generateMovieClipData('run'))
            this.roles[index].x = item.x
            this.roles[index].y = item.y
            this.addChild(this.roles[index])
        })
    }

    private initBetBtns(): void {
        let betBtnCollection = new eui.ArrayCollection(mapWithIndex(betBtnListConfig, {
            amount: 0,
            state: 'default'
        }))
        this.betBtnList.dataProvider = betBtnCollection
        this.betBtnList.addEventListener('touchTap', function (e) {
            if (e.target.name) {
                var index = parseInt(e.target.name)
                var collItem = betBtnCollection.getItemAt(index)
                betBtnCollection.replaceItemAt({
                    ...collItem,
                    amount: collItem.amount + parseInt(this.betCoin.text)
                }, index)
            }
        }, this)
    }

    private rolesDash(): void {
        this.roles.forEach(function (item, index) {
            var tw = egret.Tween.get(item)
            tw.to({
                x: item.x - getRandomInt(0, 300)
            }, 1000).call(function () {
                this.onRoleTwComplete(index)
            }, this)
        }, this)
        this.rolesTimer.stop()
    }

    private onRoleTwComplete(index: number): void {
        // only want to call once
        if (index !== 0) {
            return
        }
        var hasWin = false
        var winX = []
        this.roles.forEach(function (item) {
            if (item.x < 150) {
                hasWin = true
            }
            winX.push(item.x)
        })
        if (hasWin) {
            var minWinX = Math.min.apply(null, winX)
            console.log(winX.indexOf(minWinX))
        }
        else {
            egret.setTimeout(function () {
                if (!this.rolesTimer.running) {
                    this.rolesTimer.start()
                }
            }, this, 1000)
        }
    }

}