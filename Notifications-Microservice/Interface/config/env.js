const inDocker = process.env.IN_DOCKER === 'true';

let notAPI, userInterface;
userInterface = 'localhost'
if (inDocker) {
  notAPI = process.env.NOTIFICATION_API;
} else {
  notAPI = 'localhost';
}

module.exports.APIServer_address = `http://${notAPI}:8031`;
module.exports.APIServer_main = `${this.APIServer_address}/notifications`;

module.exports.UserInterface_address = `http://${userInterface}:8020`;
module.exports.UserInterface_main = this.UserInterface_address;

