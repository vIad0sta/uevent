const PORT = 3001;
const https = require('https');
const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const mainRoutes = require('./routers/MainRouter');
const fs = require('fs');
const { connectToDatabase, isEventFormatsTableEmpty, populateEventFormatsTable, isEventThemesTableEmpty, populateEventThemesTable } = require('./db');

const app = express();

app.use(cors({
    origin: ['https://localhost:3000', 'https://192.168.43.159:3000'],
    credentials: true
}));
app.use(express.json());
app.use('/static/images', express.static(path.join(__dirname, 'static/images')));
app.use(fileUpload({}));
app.use('/api', mainRoutes);

connectToDatabase().then(() => {
    const db = require('./models');
        db.sequelize.sync().then(() => {

            const options = {
                key: fs.readFileSync('./etc/ssl/private/localhost-key.pem'),
                cert: fs.readFileSync('./etc/ssl/certs/localhost.pem')
            };

            https.createServer(options, app).listen(PORT, () => {
                console.log(`Server started on https://localhost:${PORT}`);
            });

            isEventFormatsTableEmpty()
                .then(isEmpty => {
                    if (isEmpty) {
                        return populateEventFormatsTable();
                    }
                })
                .catch(error => {
                    console.error('Error checking or populating EventFormats table:', error);
                });

            isEventThemesTableEmpty()
                .then(isEmpty => {
                    if (isEmpty) {
                        return populateEventThemesTable();
                    }
                })
                .catch(error => {
                    console.error('Error checking or populating EventThemes table:', error);
                });

    }).catch(err => {
        console.error('Database synchronization failed:', err);
    });
});