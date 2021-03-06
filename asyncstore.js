'use strict';

var React = require('react-native');
var Promise = require('promise-es6').Promise;

var AsyncStorage = React.AsyncStorage;

var reactNativeStore = {};
var dbName = 'db_store';

var Model = function(tableName, databaseData) {
  this.tableName = tableName;
  this.databaseData = databaseData;
  this._where = null;
  this._limit = 100;
  this._offset = 0;
  return this;
};

reactNativeStore.createDataBase = function() {
  var _this = this;

  return new Promise(function(resolve, reject) {
    AsyncStorage.setItem(dbName, JSON.stringify({}), function(err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

reactNativeStore.saveTable = function(tableName, tableData) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    _this.getItem(dbName).then(function(databaseData) {
      databaseData[tableName] = tableData || {
        totalrows: 0,
        autoinc: 1,
        rows: {},
      };

      AsyncStorage.setItem(dbName, JSON.stringify(databaseData), function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(databaseData);
        }
      });
    });
  });
};

reactNativeStore.table = function(tableName) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    return _this.getItem(dbName).then(function(databaseData) {
      if (!databaseData) {
        _this.createDataBase().then(function() {
          _this.saveTable(tableName).then(function(databaseData) {
            var model = new Model(tableName, databaseData ? databaseData : {});
            resolve(model);
          });
        });
      } else {
        if (!databaseData[tableName]) {
          _this.saveTable(tableName).then(function(databaseData) {
            var model = new Model(tableName, databaseData ? databaseData : {});
            resolve(model);
          });
        } else {
          var model = new Model(tableName, databaseData ? databaseData : {});
          resolve(model);
        }
      }
    });
  });
};

reactNativeStore.getItem = function(key) {
  return new Promise(function(resolve, reject) {
    AsyncStorage.getItem(key, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(res));
      }
    });
  });
};

// where
Model.prototype.where = function(data) {
  this._where = data || null;
  return this;
};

// limit
Model.prototype.limit = function(data) {
  this._limit = data || 100;
  return this;
};

Model.prototype.offset = function(data) {
  this._offset = data || 0;
  return this;
};

Model.prototype.init = function() {
  this.where();
  this.limit();
  this.offset();
  return this;
};

Model.prototype.update = function(data, callback) {
  var _this = this;
  var results = [];
  var rows = this.databaseData[this.tableName]['rows'];

  var hasParams = false;
  if (this._where) {
    hasParams = true;
  }

  if (hasParams) {
    for (var row in rows) {
      var isMatch = true;
      for (var key in this._where) {
        if (rows[row][key] != this._where[key]) {
          isMatch = false;
        }
      }

      if (isMatch) {
        results.push(this.databaseData[this.tableName]['rows'][row]['_id']);
        for (var i in data) {
          this.databaseData[this.tableName]['rows'][row][i] = data[i];
        }
      }
    }

    this.init();
    return reactNativeStore.saveTable(this.tableName, this.databaseData[this.tableName]);
  } else {
    return null;
  }
};

Model.prototype.updateById = function(id, data) {
  this.where({
    _id: id,
  });

  return this.update(data);
};

Model.prototype.remove = function() {
  var results = [];
  var rows = this.databaseData[this.tableName]['rows'];
  var deletedIds = [];
  var hasParams = false;
  if (this._where) {
    hasParams = true;
  }

  var counter = 0;
  if (hasParams) {
    for (var row in rows) {
      var isMatch = true;

      for (var key in this._where) {
        if (rows[row][key] != this._where[key]) {
          isMatch = false;
        }
      }

      if (isMatch) {
        counter += 1;
        deletedIds.push(this.databaseData[this.tableName]['rows'][row]['_id']);
        delete this.databaseData[this.tableName]['rows'][row];
        this.databaseData[this.tableName]['totalrows']--;
      }
    }
  } else {
    counter = 0;
    for (var row in rows) {
      counter += 1;
      deletedIds.push(this.databaseData[this.tableName]['rows'][row]['_id']);
      delete this.databaseData[this.tableName]['rows'][row];
      this.databaseData[this.tableName]['totalrows']--;
    }
  }

  this.init();

  if (counter === deletedIds.length) {
    reactNativeStore.saveTable(this.tableName, this.databaseData[this.tableName]);
  } else if (callback && deletedIds.length === 0) {
    return null;
  }
};

Model.prototype.removeById = function(id, callback) {
  this.where({
    _id: id,
  });

  return this.remove();
};

Model.prototype.add = function(data) {
  var autoinc = this.databaseData[this.tableName].autoinc;
  data._id = autoinc;
  this.databaseData[this.tableName].rows[autoinc] = data;
  this.databaseData[this.tableName].autoinc += 1;
  this.databaseData[this.tableName].totalrows += 1;

  this.init();
  return reactNativeStore.saveTable(this.tableName, this.databaseData[this.tableName]);
};

Model.prototype.get = function(id) {
  this.where({
    _id: id,
  });

  return this.find(1);
};

Model.prototype.find = function() {
  var results = [];
  var rows = this.databaseData[this.tableName]['rows'];

  var hasParams = false;
  if (this._where) {
    hasParams = true;
  }

  if (hasParams) {
    for (var row in rows) {
      var isMatch = false;
      for (var key in this._where) {
        if (rows[row][key] == this._where[key]) {
          isMatch = true;
        } else {
          isMatch = false;
          break;
        }
      }

      if (isMatch) {
        results.push(rows[row]);
      }
    }
  } else {
    for (var row in rows) {
      results.push(rows[row]);
    }
  }

  if (results.length === 0) {
    return null;
  }

  if (typeof this._limit == 'number') {
    return results.slice(this._offset, this._limit + this._offset);
  } else {
    this.init();
    return results;
  }
};

module.exports = reactNativeStore;
