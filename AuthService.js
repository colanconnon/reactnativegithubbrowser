var buffer = require('buffer');
var AsyncStorage = require('react-native').AsyncStorage;
var _ = require('lodash');

const authKey = 'auth';
const userKey = 'user';

class AuthService {
  getAuthInfo(cb) {
    AsyncStorage.multiGet([authKey, userKey], (err, val)=> {
      if (err) {
        return cb(err);
      }

      if (!val) {
        return cb();
      }

      var zippedObj = _.zipObject(val);

      if (!zippedObj[authKey]) {
        return cb();
      }

      var authInfo = {
        header: {
          Authorization: zippedObj[authKey],
        },
        user: JSON.parse(zippedObj[userKey]),
      };

      return cb(null, authInfo);
    });
  }

  login(creds, cb) {
    var b = new buffer.Buffer(creds.username + ':'  +
     creds.password);
    var encodedAuth = b.toString('base64');
    var authString = 'Basic ' + encodedAuth;
    fetch('https://api.github.com/user', {
      headers: {
        Authorization: authString,
      },
    })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response;
      }

      throw {
        badCredentials: response.status == 401,
        unknownError: response.status != 401,
      };
    })
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      console.log(results);
      AsyncStorage.multiSet([
        [authKey, authString],
        [userKey, JSON.stringify(results)],
      ], (err) => {
        if (err) {
          console.log(err);
          throw err;
        }

        console.log('test');
        return cb({success: true});
      });

    })
    .catch((err)=> {
      return cb(err);
    });

  }
}

module.exports = new AuthService();
