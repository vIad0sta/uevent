module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define("Cart", {
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
    })
    Cart.associate = (models) => {
        Cart.belongsTo(models.User, {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
        Cart.belongsToMany(models.Ticket, { through: 'CartTicket' });
    };
    return Cart
};
