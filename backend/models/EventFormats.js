module.exports = (sequelize, DataTypes) => {
    const EventFormats = sequelize.define("EventFormats", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
    EventFormats.associate = models => {
        EventFormats.hasMany(models.Event)
    };
    return EventFormats
};