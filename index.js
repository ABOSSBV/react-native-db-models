'use strict';

var ReactNativeStore = require('./asyncstore');
var Events = require('eventemitter3');
var RNDBModel = {};
RNDBModel.DBEvents = new Events();

RNDBModel.createDB = function(db) {
  var _this = this;
  _this.dbName = db;

  /**
   * @description Finds all the objects based on the query
   * @param query_data
   * @param callback
   */
  this.get = function(queryData, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      var results = collection.where(queryData).find();

      if (callback) {
        callback(results);
      }
    });
  };

  /**
   * @description Finds by ID
   * @param id
   * @param callback
   */
  this.getId = function(id, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      var results = collection.get(id);

      if (callback) {
        callback(results);
      }
    });
  };

  /**
   * @description Gets all the data of the table
   * @param callback
   */
  this.getAll = function(callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      var results = collection.databaseData[_this.dbName];

      if (callback) {
        callback(results);
      }
    });
  };

  /**
   * @description Adds data to the Table in the DB
   * @param data_to_add
   * @param callback
   */
  this.add = function(dataToAdd, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      // Add Data
      collection.add(dataToAdd, function(addedDataId) {
        if (callback) {
          callback(addedDataId);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };

  /**
   * @description Removes all the objects matching the query
   * @param query_data
   * @param callback
   */
  this.remove = function(queryData, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.where(queryData).remove(function(dataRemoved) {
        if (callback) {
          callback(dataRemoved);
        }
      });
    });
  };

  /**
   * @description Removed object by ID
   * @param id
   * @param callback
   */
  this.removeId = function(id, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.removeById(id, function(dataRemoved) {
        if (callback) {
          callback(dataRemoved);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };

  /**
   * @description Erases the complete DB
   * @param callback
   */
  this.eraseDb = function(callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.remove(function(dataRemoved) {
        if (callback) {
          callback(dataRemoved);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };

  /**
   * @description Updates the Table with the query
   * @param query_data
   * @param replace_data
   * @param callback
   */
  this.update = function(queryData, replaceData, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.where(queryData).update(replaceData, function(data) {
        if (callback) {
          callback(data);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };

  /**
   * @description Updates the DB Object by ID
   * @param id
   * @param replace_data
   * @param callback
   */
  me.updateId = function(id, replaceData, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.updateById(id, replaceData, function(data) {
        if (callback) {
          callback(data);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };

  /**
   * @description Removed object by ID
   * @param id
   * @param callback
   */
  this.removeId = function(id, callback) {
    ReactNativeStore.table(_this.dbName).then(function(collection) {
      collection.removeById(id, function(dataRemoved) {
        if (callback) {
          callback(dataRemoved);
        }

        RNDBModel.DBEvents.emit('all');
      });
    });
  };
};

module.exports = RNDBModel;
