module.exports = (sequelize, DataTypes) => {
    const CompanySubscription = sequelize.define("CompanySubscription", {})
    CompanySubscription.associate = models => {
        CompanySubscription.belongsTo(models.Company, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        CompanySubscription.belongsTo(models.User, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
    };
    return CompanySubscription;
};
