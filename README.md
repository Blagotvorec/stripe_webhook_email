# Stripe Checkout Webhook Handler

## 📦 Возможности
- Принимает оплату через Stripe Checkout
- Обрабатывает событие `checkout.session.completed`
- Отправляет email с доступом клиенту после успешной оплаты

## ⚙️ Настройка

1. Скопируй `.env.example` → `.env.local` и заполни данные
2. Разверни проект на Vercel или локально
3. Подключи Webhook в Stripe:
   - URL: `/api/webhook`
   - Event: `checkout.session.completed`

## 📨 Письмо

Клиент получает доступ к Атомному Реактору с помощью email:

```
Оплату получили. 
Доступ к технологии запуска Атомного реактора: 


Заходи☝️
Остались вопросы? Напиши нам ➡️ https://t.me/touch_skills
С уважением,
Антоний Благотворец и команда 👐🏼🤍
```
