module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define("Company", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        poster: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: '/static/images/poster.avif'
        },
    });

    Company.associate = (models) => {
        Company.hasMany(models.CompanySubscription, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        Company.hasMany(models.Event, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        Company.belongsTo(models.User, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
    };
    return Company
};


