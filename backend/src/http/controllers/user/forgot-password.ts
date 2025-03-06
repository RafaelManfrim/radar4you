import jwt from 'jsonwebtoken'
// import nodemailer from 'nodemailer'
// import hbs from 'nodemailer-express-handlebars'
import { FastifyReply, FastifyRequest } from 'fastify'
// import path from 'node:path'
import { z } from 'zod'

import { knex } from '@/database'
import { env } from '@/env'

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email().nonempty(),
  })

  const { email } = forgotPasswordBodySchema.parse(request.body)

  const user = await knex('users')
    .where({
      email,
      login_provider: 'email',
    })
    .first()

  if (!user) {
    return reply.status(400).send({
      message: 'E-mail não encontrado',
    })
  }

  const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
    expiresIn: '1h',
  })

  const resetLink = `https://www.radar4you.com.br/nova-senha/${token}`
  console.log(resetLink)

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail', // Ou outro provedor
  //   auth: {
  //     user: 'seuemail@gmail.com',
  //     pass: 'suaSenhaOuAppPassword',
  //   },
  // })

  // transporter.use(
  //   'compile',
  //   hbs({
  //     viewEngine: {
  //       extname: '.hbs',
  //       partialsDir: path.resolve(
  //         __dirname,
  //         '..',
  //         '..',
  //         '..',
  //         'assets',
  //         'templates',
  //       ),
  //       defaultLayout: false,
  //     },
  //     viewPath: path.resolve(
  //       __dirname,
  //       '..',
  //       '..',
  //       '..',
  //       'assets',
  //       'templates',
  //     ),
  //     extName: '.hbs',
  //   }),
  // )

  // const mailOptions = {
  //   from: '"Suporte" <suporte@seusite.com>',
  //   to: email,
  //   subject: 'Recuperação de Senha',
  //   template: 'reset-password',
  //   context: {
  //     name: user.first_name,
  //     resetLink,
  //   },
  // }

  // await transporter.sendMail(mailOptions)

  return reply.send()
}
