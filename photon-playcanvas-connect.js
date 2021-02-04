/*jshint esversion: 6, asi: true, laxbreak: true*/
const EVENT_LIST = {
    POSITION: 0,
    ROTATION: 1,
    COMMAND: 2
}
class PhotonPlaycanvasConnect extends pc.ScriptType {
    raiseEvent(event, data) {
        // Photonを使用
        this.app.photon.raiseEvent(event, data)
    }
    // スクリプト読み込まれた際に一度実行される
    initialize() {
        this.isSync = false
        this.app.on('room:join', () => {
            this.isSync = true
            if (pc.platform.mobile) {
                //モバイル端末だった場合の処理

                this.app.touch.on(pc.EVENT_TOUCHMOVE, () => {
                    // get current Player position & rotation
                    const position = this.Player.getLocalPosition()
                    const rotation = this.Player.findByName('Camera').getLocalRotation()

                    this.raiseEvent(EVENT_LIST.ROTATION, Object.assign({}, rotation))
                    this.raiseEvent(EVENT_LIST.POSITION, Object.assign({}, position))
                })
            } else {
                // KEYDOWNイベントが発火されたら同期をする
                this.app.keyboard.on(pc.EVENT_KEYDOWN, () => {
                    // get current Player position & rotation
                    const position = this.Player.getLocalPosition()

                    this.raiseEvent(EVENT_LIST.POSITION, Object.assign({}, position))
                })
                // MOUSEMOVEイベントが発火されたら同期をする
                this.app.mouse.on(pc.EVENT_MOUSEMOVE, () => {
                    const rotation = this.Player.findByName('Camera').getLocalRotation()
                    this.raiseEvent(EVENT_LIST.ROTATION, Object.assign({}, rotation))
                })
            }
        })

        this.app.on('sync:players', actors => {
            const prefix = 'player_'
            const tagName = 'player'
            const actorNums = Object.values(actors).map(actor => actor.actorNr)
            // Playerを同期する
            for (let actor of Object.values(actors)) {
                const { isLocal, actorNr, name } = actor
                if (!isLocal) {
                    const otherPlayer = this.PlayerPrefab.clone()
                    otherPlayer.setName(`${prefix}${actorNr}`)
                    otherPlayer.tags.add(tagName)
                    otherPlayer.enabled = true
                    this.app.root.addChild(otherPlayer)
                    otherPlayer.setLocalPosition(0, 0, 0)
                }
            }
            // Playerのタグタグから現在いないPlayerを消す
            {
                const players = this.app.root.findByTag(tagName)
                for (let player of players) {
                    const actorNr = player.name.replace(prefix, '')
                    if (!actorNums.includes(Number(actorNr))) {
                        player.destroy()
                    }
                }
            }
        })

        this.app.on('sync:rotation', ({ content, actorNr }) => {
            const { y, w } = content
            const entity = this.app.root.findByName(`player_${actorNr}`)
            if (!entity) return

            entity.setLocalRotation(0, y, 0, w)
        })

        this.app.on('sync:position', ({ content, actorNr }) => {
            const { x, y, z } = content
            const entity = this.app.root.findByName(`player_${actorNr}`)
            if (!entity) return

            entity.setPosition(x, y + this.yOffset, z)
        })

        this.app.on("sync:command", ({ content, actorNr }) => {
            const entity = this.app.root.findByName(`player_${actorNr}`)
            if (!entity) return

            /*
            // 例: アニメーションを再生
            const { name } = content
            entity.animation.play(name);
            */
        })
    }
}

pc.registerScript(PhotonPlaycanvasConnect)

// Room Option
PhotonPlaycanvasConnect.attributes.add('roomName', {
    type: 'string',
    default: 'room'
})

// Sync option
PhotonPlaycanvasConnect.attributes.add('Player', { type: 'entity' })
PhotonPlaycanvasConnect.attributes.add('PlayerPrefab', { type: 'entity' })
PhotonPlaycanvasConnect.attributes.add('yOffset', {
    type: 'number',
    default: -0.7
})

PhotonPlaycanvasConnect.attributes.add('reverse', {
    title: "逆向き",
    type: 'boolean',
    default: true
})
