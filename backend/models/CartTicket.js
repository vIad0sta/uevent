module.exports = (sequelize, DataTypes) => {
    return sequelize.define("CartTicket", {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1],
                    msg: 'Quantity must be at least 1'
                },
                max: {
                    args: [5],
                    msg: 'Quantity cannot exceed 10'
                }
            }
        }
    });
};