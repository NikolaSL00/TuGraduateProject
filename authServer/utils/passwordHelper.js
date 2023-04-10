const crypto = require('crypto');
const { promisify } = require('util');

const asyncSrypt = promisify(crypto.scrypt);

exports.hashPassword = async (password) => {
  /** Hash the password. Returns the ${salt.hashedPassword} as String*/
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = await asyncSrypt(password, salt, 16);

  return salt + '.' + hash.toString('hex');
};

exports.checkPassword = async (loginPassword, storedHashedPassword) => {
  /** Check if provided password is valid. First argument provided password, second the stored in the database password .Return true or false*/
  const [storedSalt, storedHash] = storedHashedPassword.split('.');

  const checkHash = await asyncSrypt(loginPassword, storedSalt, 16);

  return checkHash.toString('hex') === storedHash;
};
