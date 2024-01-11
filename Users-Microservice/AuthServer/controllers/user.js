var User = require('../models/user')
var Counter = require('../models/counter')

module.exports.getIdProxUser = () => {
    return Counter.findByIdAndUpdate('users', { $inc: { seq: 1 } }, { new: true })
                .then(sequenceDocument => {
                    return sequenceDocument.seq.toString()
                })
                .catch(err => {
                    return err
                })
}

module.exports.list = () => {
    return User
            .find()
            .sort('name')
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}

module.exports.getUser = id => {
    return User.findById(id)
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}

module.exports.getUserByParam = (param, value) => {
    return User.findOne({[param]: value})
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}


module.exports.addUsers = userList => {
    return User.insertMany(userList)
      .then(response => {
        return response;
      })
      .catch(err => {
        return err;
      });
  };
  

module.exports.addUser = u => {
    return User.create(u)
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}

module.exports.updateUser = (id, info) => {
    var changes = { $set: info, $unset: {}}
    return User.findByIdAndUpdate(id, changes, { new: true })
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}

module.exports.deleteUser = id => {
    return User.findByIdAndRemove(id)
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}
