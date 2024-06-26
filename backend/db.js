const { EventFormats, EventThemes } = require('./models');
const Sequelize = require("sequelize");
const sequelize = new Sequelize('mysql://root:root@localhost:3306');

const isEventFormatsTableEmpty = async () => {
    const count = await EventFormats.count();
    return count === 0;
};
const populateEventFormatsTable = async () => {
    try {
        await EventFormats.bulkCreate([
            { name: 'conference' },
            { name: 'fest' },
            { name: 'lecture' },
            { name: 'workshop' }
        ]);
        console.log('EventFormats table populated with default values.');
    } catch (error) {
        console.error('Error populating EventFormats table:', error);
    }
};

const isEventThemesTableEmpty = async () => {
    const count = await EventThemes.count();
    return count === 0;
};

const populateEventThemesTable = async () => {
    try {
        await EventThemes.bulkCreate([
            { name: 'business' },
            { name: 'politics' },
            { name: 'psychology' }
        ]);
        console.log('EventThemes table populated with default values.');
    } catch (error) {
        console.error('Error populating EventThemes table:', error);
    }
};

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        await sequelize.query('CREATE DATABASE IF NOT EXISTS `uevent`;');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    isEventFormatsTableEmpty,
    populateEventFormatsTable,
    isEventThemesTableEmpty,
    populateEventThemesTable,
    connectToDatabase
};