interface BetData {
    name: string,
    times_text: string,
    times: number,
    amount: number,
    index: string,
    resource: string,
    default: string,
    active: string
}

interface Role {
    name: string,
    data: string,
    texture: string,
    x: number,
    y: number
}

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

const BET_AMOUNT = [1, 10, 20, 50, 100]
const INIT_BET_AMOUNT = 50
const INIT_TOTAL_COIN = 1000
const MAX_BET_COIN = 100
const GAME_TIME = 5000

class GameView extends eui.Component {
    public constructor() {
        super()
        this.skinName = 'resource/skins/GameView.exml'
    }

    // 游戏对象
    private roles: egret.MovieClip[] = []
    private rolesTimer: egret.Timer
    private betBtnList: eui.List
    private totalCoinLabel: eui.Label
    private betCoinLabel: eui.Label
    private startBtn: eui.Image
    private gameMap: eui.Image
    private betBtnCollection: eui.ArrayCollection
    private betMinusBtn: eui.Image
    private betPlusBtn: eui.Image
    private betTopMask: eui.Rect
    private betPanelMask: eui.Rect
    private betCancelBtn: eui.Image
    private rebetBtn: eui.Image
    
    // 游戏数据
    private betBtnListConfig: Object[] = []
    private roleConfig: Role[] = []
    private isGameRunning: boolean = false
    private isMapMoved: boolean = false
    private isMapEnd: boolean = false
    private userBetData: BetData[] = []
    private totalCoin: number = INIT_TOTAL_COIN
    private betCoin: number = INIT_BET_AMOUNT
    private nextTimer: number = null

    public childrenCreated() {
        super.createChildren()
        this.initRoles()
        this.initBetBtns()

        // 初始化文字显示
        this.totalCoinLabel.text = String(this.totalCoin)
        this.betCoinLabel.text = String(this.betCoin)

        // 绑定组件事件
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this)
        this.startBtn.addEventListener('touchTap', this.onClickStartBtn, this)
        this.betMinusBtn.addEventListener('touchTap', this.onClickBetMinusBtn, this)
        this.betPlusBtn.addEventListener('touchTap', this.onClickBetPlusBtn, this)
        this.betCancelBtn.addEventListener('touchTap', this.onClickBetCancelBtn, this)
        this.rebetBtn.addEventListener('touchTap', this.onClickRebetBtn, this)

    }

    private initRoles(): void {
        this.roleConfig = RES.getRes('role_json')
        this.roleConfig.forEach((item, index) => {
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
        this.betBtnListConfig = RES.getRes('bet_json')
        this.betBtnCollection = new eui.ArrayCollection(this.betBtnListConfig.slice())
        this.betBtnList.dataProvider = this.betBtnCollection
        this.betBtnList.addEventListener('touchTap', this.onClickBetBtn, this)
    }

    private rolesDash(): void {
        // 第一次动物跑到屏幕中间
        if (!this.isMapMoved) {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item)
                tw.to({
                    x: this.stage.stageWidth / 2 + getRandomInt(-50, 50)
                }, 1000).call(this.onRoleTwComplete.bind(this, index))
            }, this)
        }
        // 中间来回位移
        else if (!this.isMapEnd) {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item)
                tw.to({
                    x: item.x + getRandomInt(-100, 100)
                }, 1000).call(this.onRoleTwComplete.bind(this, index))
            }, this)
        }
        // 最后冲刺
        else {
            this.roles.forEach(function (item, index) {
                var tw = egret.Tween.get(item)
                var randomX = getRandomInt(-100, 100)
                var nextX = 150 + randomX
                if (nextX > item.x) {
                    nextX = 150 + getRandomInt(-100, -50)
                }
                tw.to({
                    x: 150 + getRandomInt(-100, 100)
                }, 1000).call(this.onRoleTwComplete.bind(this, index))
            }, this)
        }
        this.rolesTimer.stop()
    }

    private onRoleTwComplete(index: number): void {
        // only want to call once
        if (index !== 0) {
            return
        }

        if (!this.isMapMoved) {
            this.isMapMoved = true

            let tw = egret.Tween.get(this.gameMap)
            tw.to({
                x: 0
            }, GAME_TIME).call(() => {
                this.isMapEnd = true
                egret.clearTimeout(this.nextTimer)
                this.rolesDash()
            })
        }

        let delay = this.isMapEnd ? 200 : 1000

        this.nextTimer = egret.setTimeout(function () {
            if (!this.rolesTimer.running && this.isGameRunning) {
                this.rolesTimer.start()
            }
        }, this, delay)
    }

    private onClickBetBtn(e: egret.Event): void {
        if (e.target.name) {
            var index = parseInt(e.target.name)
            var collItem = this.betBtnCollection.getItemAt(index)
            var nextAmount = this.getNextBetAmount(collItem.amount)
            var diffAmount = nextAmount - collItem.amount
            this.totalCoin -= diffAmount
            this.totalCoinLabel.text = String(this.totalCoin)

            this.betBtnCollection.replaceItemAt({
                ...collItem,
                amount: nextAmount
            }, index)
        }
    }

    private getNextBetAmount(a) {
        if (a + this.betCoin <= MAX_BET_COIN) {
            return a + this.betCoin
        }
        return MAX_BET_COIN
    }

    private onEnterFrame(): void {
        if (this.isGameRunning) {
            var hasWinRole = false
            var winRolesX: number[] = []
            this.roles.forEach(function (item, index) {
                if (item.x < 150) {
                    hasWinRole = true
                }
                winRolesX.push(item.x)
            }, this)

            if (hasWinRole) {
                this.betTopMask.fillAlpha = 0
                this.betPanelMask.fillAlpha = 0
                this.isGameRunning = false
                this.roles.forEach(function (item) {
                    item.stop()
                    egret.Tween.removeTweens(item)
                }, this)

                let winX = Math.min.apply(null, winRolesX)
                let winIndex = winRolesX.indexOf(winX)

                this.roles.forEach((item, index) => {
                    if (index === winIndex) {
                        // 更换冠军图片
                        var collItem = this.betBtnCollection.getItemAt(index)
                        this.betBtnCollection.replaceItemAt({
                            ...collItem,
                            resource: collItem.active
                        }, index)

                        let tw = egret.Tween.get(item)
                        tw
                        .wait(500)
                        .to({ alpha: 0 }).wait(500)
                        .to({ alpha: 1 }).wait(500)
                        .to({ alpha: 0 }).wait(500)
                        .to({ alpha: 1 }).wait(500)
                        .call(() => {
                            egret.Tween.removeTweens(item)

                            // 计算输赢金币
                            var winCoin = 0
                            this.userBetData.forEach(function(bet, index) {
                                if (index === winIndex) {
                                    winCoin += bet.amount * bet.times
                                }
                            })
                            this.totalCoin += winCoin
                            this.totalCoinLabel.text = String(this.totalCoin)

                            

                            this.roles.forEach((item) => {
                                item.visible = false
                            })

                            let tw = egret.Tween.get(this.gameMap)
                            tw.to({
                                x: -1920
                            }, 500).call(() => {
                                this.roleConfig.forEach((item, index) => {
                                    this.roles[index].x = item.x
                                    this.roles[index].visible = true
                                })
                                this.isMapMoved = false
                                this.isMapEnd = false
                                this.startBtn.visible = true
                                this.betBtnCollection.replaceAll(this.betBtnListConfig.slice())
                            })
                        
                            this.betTopMask.fillAlpha = 0.5
                            this.betPanelMask.fillAlpha = 0.5
                            this.betTopMask.visible = false
                            this.betPanelMask.visible = false
                        }, this)
                    }
                }, this)
            }
        }
    }

    private onClickStartBtn(): void {
        this.betTopMask.visible = true
        this.betPanelMask.visible = true
        this.startBtn.visible = false
        this.isGameRunning = true

        this.userBetData = this.betBtnCollection.source.slice()

        this.roles.forEach((item) => {
            item.gotoAndPlay(1, -1)
        })

        this.rolesTimer = new egret.Timer(1000, -1)
        this.rolesTimer.addEventListener('timer', this.rolesDash, this)
        this.rolesTimer.start()
        this.rolesDash()
    }

    private onClickBetMinusBtn(): void {
        var i = BET_AMOUNT.indexOf(this.betCoin)
        if (typeof BET_AMOUNT[i - 1] !== 'undefined') {
            this.betCoin = BET_AMOUNT[i - 1]
        }
        else {
            this.betCoin = BET_AMOUNT[BET_AMOUNT.length - 1]
        }
        this.betCoinLabel.text = String(this.betCoin)
    }

    private onClickBetPlusBtn(): void {
        var i = BET_AMOUNT.indexOf(this.betCoin)
        if (typeof BET_AMOUNT[i + 1] !== 'undefined') {
            this.betCoin = BET_AMOUNT[i + 1]
        }
        else {
            this.betCoin = BET_AMOUNT[0]
        }
        this.betCoinLabel.text = String(this.betCoin)
    }

    private onClickBetCancelBtn():void {
        this.betBtnCollection.replaceAll(this.betBtnListConfig.slice())
    }

    private onClickRebetBtn(): void {
        if (this.userBetData.length) {
            this.betBtnCollection.replaceAll(this.userBetData.slice())
        }
    }

}