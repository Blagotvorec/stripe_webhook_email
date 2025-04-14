import { buffer } from 'micro';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_details.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: customerEmail,
      subject: 'Доступ к Атомному Реактору',
      text: `Оплату получили.\n\nДоступ к технологии запуска Атомного реактора:\nhttps://t.me/+tNZa9VnvPyxjYjEy\n\nЗаходи☝️\n\nОстались вопросы? Напиши нам ➡️ https://t.me/touch_skills\n\nС уважением,\n\nАнтоний Благотворец и команда 👐🏼🤍`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Письмо успешно отправлено:', customerEmail);
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
    }
  }

  res.status(200).json({ received: true });
}