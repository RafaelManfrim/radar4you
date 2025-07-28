import { createMailTransporter } from './create-mail-transporter'

interface SendResetPasswordEmailOptions {
  recipientEmail: string
  resetLink: string
  userName: string
}

export async function sendResetPasswordEmail({
  recipientEmail,
  resetLink,
  userName,
}: SendResetPasswordEmailOptions) {
  const htmlContent = `
    <h1>Olá ${userName}!</h1>
    <p>Você solicitou a redefinição de sua senha.</p>
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Se você não solicitou essa redefinição, por favor, ignore este e-mail.</p>
    <p>Atenciosamente,</p>
    <p>Equipe Radar4you</p>
  `

  const mailOptions = {
    from: '"Radar4you" <nao-responda@radar4you.com.br>',
    to: recipientEmail,
    subject: 'Redefinição de Senha - Radar4you',
    text: `
      Olá ${userName}, você solicitou a redefinição de senha. Clique no link abaixo para redefinir sua senha. 
      ${resetLink}
      Se você não solicitou essa redefinição, por favor, ignore este e-mail.
      Atenciosamente, Equipe Radar4you
    `,
    html: htmlContent,
  }

  const transporter = createMailTransporter()

  await transporter.sendMail(mailOptions)
}
