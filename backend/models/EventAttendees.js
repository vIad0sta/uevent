module.exports = (sequelize, DataTypes) => {
    const EventAttendees = sequelize.define("EventAttendees", {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    })
    EventAttendees.associate = models => {
        EventAttendees.belongsTo(models.Ticket, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        EventAttendees.belongsTo(models.User, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
    };
    return EventAttendees;
};
