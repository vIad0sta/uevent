module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creationTime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        editTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
    })

    Comment.associate = models => {
        Comment.belongsTo(models.Event, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
        Comment.belongsTo(models.User, {
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE',
        });
    };
    return Comment;
};