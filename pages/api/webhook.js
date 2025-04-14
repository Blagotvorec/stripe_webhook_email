// pages/api/webhook.js

import { buffer } from 'micro'
import Stripe from 'stripe'
import nodemailer from 'nodemailer'

export const config = {
  api: {
    bodyParser: false,
  },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY1)

const transporter = nodemailer.createTransport({
  service: 'gmail', // замените, если используете другой SMTP
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req)
    const sig = req.headers['stripe-signature']

    let event
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook Error:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: session.customer_details.email,
          subject: 'Доступ к Атомному Реактору',
          text: `Оплату получили. Доступ к технологии запуска Атомного реактора: https://t.me/+tNZa9VnvPyxjYjEy\n\nОстались вопросы? Напиши нам ➡️ https://t.me/touch_skills\n\nС уважением,\nАнтоний Благотворец и команда 👐🏼🤍`,
        })
      } catch (error) {
        console.error('Email send error:', error)
        return res.status(500).json({ message: 'Email send failed' })
      }
    }

    res.status(200).json({ received: true })
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
