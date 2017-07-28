var bcrypt = require('bcrypt');
var _ = require('underscore');
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL, ///virtual dont store in database but it is accceable
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashPassword);
			}
		}
	}, {
		hooks: { //to do not allow the save email with diff letter
			beforeValidate: function(user, option) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}

		},
		instanceMethods: {//instance method should  be an object
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json ,'id', 'email', 	'createdAt', 'updatedAt');
			}
		}
	});
};