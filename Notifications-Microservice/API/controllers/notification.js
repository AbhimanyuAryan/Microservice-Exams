var Notification = require('../models/notification');


module.exports.getAllNotificationsForUser = id => {
    return Notification.findOne({ _id: id })
      .then((user) => {
        if (user) {
            const sortedNotifications = user.notifications.sort((a, b) => b.date - a.date);

            return sortedNotifications;
        } else {
          return Error('User not found');
        }
      })
      .catch((err) => {
        return err
      });
};

module.exports.markNotificationAsRead = (userId, notificationId) => {
    return Notification.findOneAndUpdate(
      { _id: userId, 'notifications._id': notificationId },
      { $set: { 'notifications.$.read': true } },
      { new: true }
    )
      .exec()
      .then((user) => {
        if (user) {
          const readNotification = user.notifications.find(notification => notification._id.toString() === notificationId);
          return readNotification;
        } else {
          throw new Error('User not found');
        }
      })
      .catch((err) => {
        throw err;
      });
  };

module.exports.countAllNonReadNotificationsForUser = id => {
return Notification.findOne({ _id: id })
    .then((user) => {
    if (user) {
        const nonReadNotifications = user.notifications.filter(notification => !notification.read);
                    
        return nonReadNotifications.length;
    } else {
        return Error('User not found');
    }
    })
    .catch((err) => {
    return err
    });
};

  
module.exports.addUserNotification = u => {
    return Notification.create(u)
            .then(response => {
                return response
            })
            .catch(err => {
                return err
            })
}

module.exports.addUserNotifications = list => {
    return Notification.insertMany(list)
        .then(response => {
            return response;
        })
        .catch(err => {
            return err;
        });
};

module.exports.addNotificationToUser = (id, notification) => {
    return Notification.findByIdAndUpdate(
        id,
        { $push: { notifications: notification } },
        { new: true, upsert: true }
    )
    .then(response => {
        return response;
    })
    .catch(err => {
        return err;
    });
};


