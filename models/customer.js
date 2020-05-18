/* eslint-disable prettier/prettier */
/* eslint-disable indent */

module.exports = function (sequelize, DataTypes) {
    var Customer = sequelize.define("Customer", {
        userFirstName: DataTypes.STRING,
        userLastName: DataTypes.STRING,
        userName: { type: DataTypes.STRING, unique: true },
        userEmail: DataTypes.STRING,
        userZip: DataTypes.STRING,
        userPassword: DataTypes.STRING
    });


    return Customer;
};
