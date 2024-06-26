const cartService = require("../services/CartService");

class CompanyController{
    async addCart(req, res, next){
        try{
            let cart = await cartService.addCart(req.body);
            return res.status(201).json(cart);
        }
        catch(e){
            next(e);
        }
    }
    async getCart(req,res,next) {
        try{
            const cart = await cartService.getCart(req.params.cartId)
            return res.status(200).json(cart)
        }
        catch (e) {
            next(e)
        }
    }
    async getCartTickets(req,res,next) {
        try{
            const cartTickets = await cartService.getCartTickets(req.params.cartId)
            return res.status(200).json({cartTickets: cartTickets})
        }
        catch (e) {
            next(e)
        }
    }
    async getCartTicketsAndEvents(req,res,next) {
        try{
            const cartTickets = await cartService.getCartTicketsAndEvents(req.params.cartId)
            return res.status(200).json({cartTickets: cartTickets})
        }
        catch (e) {
            next(e)
        }
    }
    async updateCart(req, res, next){
        try{
            const cart = await cartService.updateCart(req.body);
            return res.status(200).send(cart);
        }
        catch (e) {
            next(e);
        }
    }
    async addCartTicket(req, res, next){
        try{
            const cartTicket = await cartService.addCartTicket(req.body)
            return res.status(200).send(cartTicket);
        }
        catch (e) {
            next(e);
        }
    }
    async updateCartTicket(req, res, next){
        try{
            await cartService.updateCartTicket(req.body, req.params.cartId, req.params.ticketId)
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
    async deleteCart(req, res, next){
        try{
            await cartService.deleteCart(req.params.cartId)
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
    async deleteCartTicket(req, res, next){
        try{
            await cartService.deleteCartTicket(req.params.cartId, req.params.ticketId)
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
    async clearCart(req, res, next){
        try{
            await cartService.clearCart(req.params.cartId);
            return res.status(200).send(await cartService.getCart(req.params.cartId));
        }
        catch (e) {
            next(e);
        }
    }
}


module.exports = new CompanyController();