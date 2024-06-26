const STRIPE_SECRET_KEY = 'sk_test_51P4RqnFFsE5TFYGd2s9AUBeX4cf1IkZSK1mvOvPii94hLEapaoFaysuOxyPL6WtKHPPV9bIMpu86tCwcxYOFhsuw00PUSipAEP'
const stripe = require('stripe')(STRIPE_SECRET_KEY);
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
