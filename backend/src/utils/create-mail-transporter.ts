import { env } from '@/env'
import nodemailer from 'nodemailer'

export function createMailTransporter() {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  })

  return transporter
}
