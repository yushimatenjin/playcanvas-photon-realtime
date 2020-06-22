/*jshint esversion: 6, asi: true, laxbreak: true*/

class PhotonPlayCanvas extends pc.ScriptType {
    initialize () {
      const options = {
        app: this.app,
        appId: this.appId,
        appVersion: this.appVersion,
        wss: this.wss ? 1 : 0
      }
  
      // Photonのセットアップ
      this.app.photon = new LoadBalancing(options)
  
      // Connect to Photon Server
      this.app.photon.connectToRegionMaster(this.region)
  
      this.app.on('lobby:join', () => {
        if (this.app.photon.roomInfos.length === 0) {
          try {
            this.createRoom(this.roomName)
          } catch (e) {
            this.joinRoom(this.roomName)
          }
        } else {
          this.joinRoom(this.roomName)
        }
      })
    }
  
    createRoom (roomName) {
      this.app.photon.createRoom(roomName)
    }
  
    joinRoom (roomName) {
      this.app.photon.joinRoom(roomName)
    }
  }
  
  pc.registerScript(PhotonPlayCanvas)
  // LoadBalancing options
  PhotonPlayCanvas.attributes.add('appId', { type: 'string' })
  PhotonPlayCanvas.attributes.add('appVersion', {
    type: 'string',
    default: '1.0'
  })
  PhotonPlayCanvas.attributes.add('wss', { type: 'boolean', default: true })
  
  // Photon realtime options
  PhotonPlayCanvas.attributes.add('region', {
    type: 'string',
    default: 'jp',
    description:
      'Photon Cloud has servers in several regions, distributed across multiple hosting centers over the world.You can choose optimized region for you.',
    enum: [
      { 'Select Region': 'default' },
      { 'Asia, Singapore': 'asia' },
      { 'Australia, Melbourne': 'au' },
      { 'Chinese Mainland (See Instructions)	Shanghai': 'cn' },
      { 'Canada, East Montreal': 'cae' },
      { 'Europe, Amsterdam': 'eu' },
      { 'India, Chennai': 'in' },
      { 'Japan, Tokyo': 'jp' },
      { 'South America, Sao Paulo': 'sa' },
      { 'South Korea, Seoul': 'kr' },
      { 'USA, East Washington': 'us' },
      { 'USA, West San José': 'usw' }
    ]
  })
  
  // Room options
  PhotonPlayCanvas.attributes.add('roomName', { type: 'string', default: 'room' })
  