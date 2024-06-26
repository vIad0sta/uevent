const stripe = require('stripe')(procces.env.STRIPE_SECRET_KEY);
class PaymentController {

    async createPaymentIntent(req, res, next) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: req.body.amount,
                currency: 'usd',
            });
            res.json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();
