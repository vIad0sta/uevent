module.exports = (sequelize, DataTypes) => {
    const EventThemes = sequelize.define("EventThemes", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    })
    EventThemes.associate = models => {
        EventThemes.hasMany(models.Event)
    };
    return EventThemes
};