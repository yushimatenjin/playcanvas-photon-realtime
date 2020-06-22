class LoadBalancing extends Photon.LoadBalancing.LoadBalancingClient {
  constructor (props) {
    // Photon Settings
    const wss = props.wss
    const appId = props.appId
    const appVersion = props.appVersion
    super(wss, appId, appVersion)
    // pc.Application
    this.app = props.app

    this.setLogLevel(4)
  }

  onStateChange (state) {
    if (state === 5) {
    }
  }
  onLobbyStats (state) {}

  onRoomList (e) {
    this.app.fire('lobby:join')
  }

  onJoinRoom (e) {
    this.app.fire('room:join')
  }

  onEvent (code, content, actorNr) {
    const payload = { code, content, actorNr }
    if (code === 0) {
      this.app.fire('sync:position', payload)
      return
    }
    if (code === 1) {
      this.app.fire('sync:rotation', payload)
    }
  }

  onActorJoin (e) {
    const payload = Object.assign({}, this.myRoomActors())
    this.app.fire('sync:players', payload)
  }

  onActorLeave (e) {
    const payload = Object.assign({}, this.myRoomActors())
    this.app.fire('sync:players', payload)
  }
}
