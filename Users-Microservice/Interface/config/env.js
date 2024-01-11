const inDocker = process.env.IN_DOCKER === 'true';

let notAPI, notInterface, authServer;
notInterface = 'localhost'
if (inDocker) {
  notAPI = process.env.NOTIFICATION_API;
  authServer = process.env.AUTH_SERVER
} else {
  notAPI = 'localhost';
  authServer = 'localhost'
}

module.exports.AuthServer_address =  `http://${authServer}:8021`
module.exports.AuthServer_main = this.AuthServer_address + '/users'

module.exports.NoficationAPI_address = `http://${notAPI}:8031`
module.exports.NoficationAPI_main = this.NoficationAPI_address + '/notifications'

module.exports.NoficationInterface_address = `http://${notInterface}:8030`
module.exports.NoficationInterface_main = this.NoficationInterface_address
