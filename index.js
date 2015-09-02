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
  this.get = function(queryData) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.where(queryData).find();
    });
  };

  /**
   * @description Finds by ID
   * @param id
   * @param callback
   */
  this.getId = function(id) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.get(id);
    });
  };

  /**
   * @description Gets all the data of the table
   * @param callback
   */
  this.getAll = function() {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.databaseData[_this.dbName];
    });
  };

  /**
   * @description Adds data to the Table in the DB
   * @param data_to_add
   * @param callback
   */
  this.add = function(dataToAdd) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      // Add Data
      return collection.add(dataToAdd);
    });
  };

  /**
   * @description Removes all the objects matching the query
   * @param query_data
   * @param callback
   */
  this.remove = function(queryData) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.where(queryData).remove();
    });
  };

  /**
   * @description Removed object by ID
   * @param id
   * @param callback
   */
  this.removeId = function(id) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.removeById(id);
    });
  };

  /**
   * @description Erases the complete DB
   * @param callback
   */
  this.eraseDb = function() {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.remove();
    });
  };

  /**
   * @description Updates the Table with the query
   * @param query_data
   * @param replace_data
   * @param callback
   */
  this.update = function(queryData, replaceData) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.where(queryData).update(replaceData);
    });
  };

  /**
   * @description Updates the DB Object by ID
   * @param id
   * @param replace_data
   * @param callback
   */
  me.updateId = function(id, replaceData) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.updateById(id, replaceData);
    });
  };

  /**
   * @description Removed object by ID
   * @param id
   * @param callback
   */
  this.removeId = function(id) {
    return ReactNativeStore.table(_this.dbName).then(function(collection) {
      return collection.removeById(id);
    });
  };
};

module.exports = RNDBModel;
