const {Company} = require('../models');
const CompanyDTO = require("../dto/CompanyDTO");

class CompanyService {
    async addCompany(company) {
        return new CompanyDTO(await Company.create(company))
    }
    async getCompany(companyId) {
        return new CompanyDTO(await Company.findByPk(companyId))
    }

    async updateCompany(company) {
        return new CompanyDTO(await Company.update(company, {
            where: {id: company.id}
        }))
    }

    async getCompanies() {
        let companies = await Company.findAll();
        if (!companies)
            return;
        return companies.map(company => new CompanyDTO(company))
    }

    async getCompaniesByUser(userId) {
        let companies = await Company.findAll({
            where: {UserId: userId}
        });
        if (!companies)
            return;
        return companies.map(company => new CompanyDTO(company))
    }

}


module.exports = new CompanyService()