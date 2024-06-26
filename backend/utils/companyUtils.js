const companyService = require("../services/CompanyService");
const eventService = require("../services/EventService");

module.exports = async function checkOwner(req, res, next){
    let companyId;
    if (req.body.id) companyId = req.body.id;
    else if (req.body.CompanyId) companyId = req.body.CompanyId;
    else if (req.body.EventId) {
        const event = await eventService.getEvent(req.body.EventId);
        companyId = event.CompanyId;
    }

    const company = await companyService.getCompany(companyId);
    if (company.UserId !== req.user.id) {
        return res.status(403).json({ message: 'You are not the owner of the company' });
    }
    next();
}