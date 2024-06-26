const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controllers/CompanyController');
const jwtGenerator = require("../security/JwtGenerator");
const errorHandler = require("../ErrorHandler");
const checkOwner = require('../utils/companyUtils')

companyRouter.get('/:id', jwtGenerator.decodeToken,companyController.getCompany);
companyRouter.get('/users/:userId', companyController.getCompaniesByUser);
companyRouter.get('/', companyController.getCompanies);
companyRouter.post('/', jwtGenerator.verifyToken, companyController.addCompany);
companyRouter.patch('/', jwtGenerator.verifyToken, checkOwner, companyController.updateCompany);
companyRouter.use((err, req, res, next) => errorHandler(err, req, res, next));
module.exports = companyRouter;