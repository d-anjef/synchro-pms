// ============================================
// 1. WELCOME EMAIL (sent on signup)
// ============================================
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
                Welcome aboard! Your account has been successfully created. You're now on a <strong>14-day Pro trial</strong> — enjoy all premium features free!
              </p>
              <h3 style="color:#111827;margin-top:24px;font-size:16px;">🚀 Get started in 3 steps:</h3>
              <ol style="color:#4b5563;font-size:14px;line-height:1.8;">
                <li>Create your first project</li>
                <li>Invite teammates (up to 10)</li>
                <li>Start tracking tasks on the kanban board</li>
              </ol>
              <table style="margin:24px auto;">
                <tr>
                  <td style="background:#111827;border-radius:10px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" 
                       style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;margin-top:24px;">
                Best regards,<br/><strong>The Synchro Team</strong>
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

// ============================================
// 2. RESET PASSWORD EMAIL
// ============================================
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

// ============================================
// 3. TRIAL ENDING REMINDER EMAIL
// ============================================
export const trialEndingTemplate = (name, daysLeft) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b 0%,#ec4899 100%);padding:30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:24px;">⏰ Trial Ending in ${daysLeft} Days</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#111827;margin:0 0 16px;">Hi ${name},</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                Your Pro trial ends in <strong>${daysLeft} days</strong>. Don't lose access to:
              </p>
              <ul style="color:#4b5563;font-size:14px;line-height:1.8;">
                <li>✨ Unlimited projects & tasks</li>
                <li>👥 Team collaboration (up to 10 members)</li>
                <li>📁 10 GB file storage</li>
                <li>⚡ Realtime updates</li>
                <li>🎯 Goals tracking</li>
              </ul>
              <p style="color:#4b5563;font-size:15px;margin-top:20px;">
                Continue at just <strong>Rs. 999/month</strong> (or save 17% with yearly).
              </p>
              <table style="margin:24px auto;">
                <tr>
                  <td style="background:#111827;border-radius:10px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/billing" 
                       style="display:inline-block;padding:14px 36px;color:#fff;text-decoration:none;font-weight:600;">
                      Upgrade Now →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ============================================
// 4. PAYMENT SUCCESS EMAIL
// ============================================
export const paymentSuccessTemplate = (name, plan, amount, txnId) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;font-family:'Segoe UI',sans-serif;background:#f5f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#22c55e;padding:30px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">✅ Payment Successful!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#111827;margin:0 0 16px;">Hi ${name},</h2>
              <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                Thanks for upgrading to <strong>${plan}</strong>! Your subscription is now active.
              </p>
              <table width="100%" style="background:#f9fafb;border-radius:10px;padding:16px;margin:20px 0;">
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:6px 0;">Plan</td>
                  <td style="color:#111827;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">${plan}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:6px 0;">Amount</td>
                  <td style="color:#111827;font-size:14px;font-weight:600;text-align:right;padding:6px 0;">Rs. ${amount}</td>
                </tr>
                <tr>
                  <td style="color:#6b7280;font-size:13px;padding:6px 0;">Transaction ID</td>
                  <td style="color:#111827;font-size:12px;font-family:monospace;text-align:right;padding:6px 0;">${txnId}</td>
                </tr>
              </table>
              <p style="color:#6b7280;font-size:13px;margin-top:24px;">
                Need a refund? Reply within 14 days. <br />
                Questions? Just reply to this email.
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