import nodemailer from "nodemailer";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOTPEmail(email: string, otp: string, teamName: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[DEV MODE] Skipping email send. OTP for ${email} is: ${otp}`);
    return true;
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.SMTP_FROM || '"A&B Tournaments" <noreply@abtournaments.com>',
    to: email,
    subject: "Verify Your Registration - A&B Tournaments",
    text: `Hello ${teamName},\n\nYour verification code is: ${otp}\n\nThis code will expire in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 4px solid #0A192F; background-color: #ffffff;">
        <h2 style="color: #0A192F; text-transform: uppercase; letter-spacing: 1px; font-weight: 900; font-size: 24px;">Verify Your Registration</h2>
        <p style="color: #0A192F;">Hello <strong>${teamName}</strong>,</p>
        <p style="color: #0A192F;">Thank you for registering for the upcoming tournament. Please use the following 6-digit code to verify your registration:</p>
        <div style="background-color: #f4f4f5; padding: 16px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 8px; margin: 24px 0; border: 2px solid #0A192F; color: #E63946;">
          ${otp}
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}

export async function sendTicketEmail(email: string, teamName: string, competitionTitle: string, ticketNumber: string, whatsappLink?: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[DEV MODE] Skipping ticket email send. Ticket for ${email} is: ${ticketNumber}`);
    return true;
  }

  const transporter = getTransporter();

  const whatsappSection = whatsappLink ? `
    <div style="margin-top: 32px; padding: 16px; background-color: #25D366; border: 2px solid #0A192F;">
      <h3 style="color: #0A192F; margin-top: 0; text-transform: uppercase;">Join the official WhatsApp Group</h3>
      <p style="color: #0A192F; margin-bottom: 0;">Stay updated with schedules and announcements.</p>
      <a href="${whatsappLink}" style="display: inline-block; margin-top: 16px; background-color: #0A192F; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Join Group</a>
    </div>
  ` : "";

  const mailOptions = {
    from: process.env.SMTP_FROM || '"A&B Tournaments" <noreply@abtournaments.com>',
    to: email,
    subject: `Your Tournament Ticket: ${competitionTitle}`,
    text: `Hello ${teamName},\n\nYou are successfully enrolled in ${competitionTitle}!\nYour Ticket Number is: ${ticketNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 4px solid #0A192F; background-color: #ffffff;">
        <h2 style="color: #E63946; text-transform: uppercase; letter-spacing: 1px; font-weight: 900; font-size: 28px; margin-bottom: 8px;">Registration Confirmed!</h2>
        <h3 style="color: #0A192F; font-size: 20px; margin-top: 0; text-transform: uppercase;">${competitionTitle}</h3>
        
        <p style="color: #0A192F; font-size: 16px; line-height: 1.5;">Hello <strong>${teamName}</strong>,</p>
        <p style="color: #0A192F; font-size: 16px; line-height: 1.5;">You are officially enrolled in the tournament. Please present this ticket number to the organizers on the day of the event.</p>
        
        <div style="background-color: #f4f4f5; padding: 24px; text-align: center; margin: 32px 0; border: 4px dashed #0A192F; position: relative;">
          <p style="color: #0A192F; text-transform: uppercase; font-weight: bold; letter-spacing: 2px; margin-top: 0; margin-bottom: 8px;">Official Entry Ticket</p>
          <div style="font-size: 36px; font-weight: 900; letter-spacing: 4px; color: #E63946;">
            ${ticketNumber}
          </div>
        </div>

        ${whatsappSection}
        
        <div style="margin-top: 40px; border-top: 2px solid #0A192F; padding-top: 24px;">
          <p style="color: #666; font-size: 12px; text-align: center;">A&B Tournaments - Let's Compete</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return true;
}
