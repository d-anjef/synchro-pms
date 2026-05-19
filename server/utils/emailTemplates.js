export const resetPasswordTemplate = (name, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#111827 0%,#1f2937 100%);padding:40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Synchro PMS</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Hello ${name},</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 24px;">
                We received a request to reset your password. Click the button below to create a new password. This link is valid for <strong>15 minutes</strong>.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:32px auto;">
                <tr>
                  <td style="background:#111827;border-radius:10px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:24px 0 0;">
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
              </p>
              <p style="color:#9ca3af;font-size:12px;margin-top:24px;word-break:break-all;">
                Or copy this link: ${resetUrl}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Synchro PMS. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const welcomeTemplate = (name) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#111827 0%,#1f2937 100%);padding:40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Welcome to Synchro PMS 🎉</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#111827;margin:0 0 16px;font-size:22px;">Hi ${name},</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                Welcome aboard! Your account has been successfully created. Start managing your projects, collaborating with your team, and boosting productivity today.
              </p>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;margin-top:24px;">
                Best regards,<br/><strong>The Synchro Team</strong>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;