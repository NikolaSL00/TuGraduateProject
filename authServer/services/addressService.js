const Address = require("../models/Address");
exports.create = (addressData) => Address.create(addressData);
exports.findById = (addressId) => Address.findById(addressId).lean();
