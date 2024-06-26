module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.ENUM('admin', 'user', 'guest'),
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/static/images/default.png'
        },
        isMfaEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        isEmailVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        mfaSecret : {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    })
    User.associate = models => {
        User.hasMany(models.Company)
        User.hasOne(models.Cart);
        User.hasMany(models.Comment);
        User.hasMany(models.CompanySubscription);
        User.hasMany(models.EventAttendees);
    };
    return User
};
