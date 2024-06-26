const companyService = require("../services/CompanyService");

class CompanyController{
    async addCompany(req, res, next){
        try{
            let result = await companyService.addCompany(req.body);
            return res.status(201).json(result);
        }
        catch(e){
            next(e);
        }
    }
    async getCompany(req,res,next) {
        try{
            const company = await companyService.getCompany(req.params.id)
            let isOwner = (req.user !== undefined && req.user.id === company.UserId);
            return res.status(200).json({company: company, isOwner: isOwner})
        }
        catch (e) {
            next(e)
        }
    }

    async getCompaniesByUser(req,res,next) {
        try{
            const companies = await companyService.getCompaniesByUser(req.params.userId)
            return res.status(200).json({companies: companies})
        }
        catch (e) {
            next(e)
        }
    }
    async getCompanies(req, res, next){
        try{
            const events = await companyService.getCompanies();
            return res.status(200).json(events);
        }
        catch (e){
            next(e);
        }
    }

    async updateCompany(req, res, next){
        try{
            await companyService.updateCompany(req.body);
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
}


module.exports = new CompanyController();