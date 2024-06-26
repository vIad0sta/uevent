module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define("Event", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        startTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endTime: {
            type: DataTypes.DATE,
            allowNull: false
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
        attendeesVisibility: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    })
    Event.associate = (models) => {
        Event.hasMany(models.Ticket, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        Event.hasMany(models.Comment)
        Event.belongsTo(models.Company)
        Event.belongsTo(models.EventFormats, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        Event.belongsTo(models.EventThemes, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
    };
    return Event
};
