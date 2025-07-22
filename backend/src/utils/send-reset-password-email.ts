import { createMailTransporter } from './create-mail-transporter'

interface SendResetPasswordEmailOptions {
  recipientEmail: string
  resetLink: string
}

export async function sendResetPasswordEmail({
  recipientEmail,
  resetLink,
}: SendResetPasswordEmailOptions) {
  const htmlContent = `
    <h1>Olá!</h1>
    <p>Você solicitou a redefinição de sua senha.</p>
    <p>Por favor, clique no link abaixo para redefinir sua senha:</p>
    <a href="${resetLink}">Redefinir Senha</a>
    <p>Se você não solicitou essa redefinição, por favor, ignore este e-mail.</p>
    <p>Atenciosamente,</p>
    <p>Equipe Radar4you</p>
  `

  const mailOptions = {
    from: '"Radar4you" <nao-responda@radar4you.com.br>',
    to: recipientEmail,
    subject: 'Redefinição de Senha - Radar4you',
    text: `
      Olá, você solicitou a redefinição de senha. Por favor, clique no link abaixo para redefinir sua senha. 
      ${resetLink}
      Se você não solicitou essa redefinição, por favor, ignore este e-mail.
      Atenciosamente, Equipe Radar4you
    `,
    html: htmlContent,
  }

  const transporter = createMailTransporter()

  await transporter.sendMail(mailOptions)
}
