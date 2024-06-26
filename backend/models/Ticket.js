module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define("Ticket", {
        type: {
          type: DataTypes.STRING,
          allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    Ticket.associate = models => {
        Ticket.hasMany(models.EventAttendees);
        Ticket.belongsTo(models.Event)
        Ticket.belongsToMany(models.Cart, {onDelete: 'CASCADE', through: 'CartTicket' });
    };
    return Ticket
};
