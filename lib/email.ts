import { Resend } from "resend";

export async function sendVerificationEmail(email: string, name: string, code: string) {
  if (!process.env.RESEND_API_KEY) {
    // Dev fallback: log to console
    console.log(`[EMAIL] Verification code for ${email}: ${code}`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "iLeilão <noreply@ileilao.com>",
    to: email,
    subject: `${code} é o seu código de verificação — iLeilão`,
    html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#1d4ed8;padding:28px 40px;">
            <span style="font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
              <span style="color:#93c5fd;">i</span>Leilão
            </span>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
              Verifique seu e-mail
            </p>
            <p style="margin:0 0 32px;font-size:14px;color:#6b7280;line-height:1.6;">
              Olá, ${name.split(" ")[0]}! Use o código abaixo para confirmar o seu cadastro no iLeilão.
              O código expira em <strong>15 minutos</strong>.
            </p>

            <!-- Code box -->
            <div style="background:#eff6ff;border:2px dashed #93c5fd;border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#3b82f6;letter-spacing:2px;text-transform:uppercase;">Seu código de verificação</p>
              <p style="margin:0;font-size:40px;font-weight:900;color:#1d4ed8;letter-spacing:12px;">${code}</p>
            </div>

            <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
              Se você não criou uma conta no iLeilão, ignore este e-mail.<br>
              Nunca compartilhe este código com ninguém.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
              © ${new Date().getFullYear()} iLeilão · ileilao.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
}
