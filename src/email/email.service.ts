import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.office365.com", // e.g., 'smtp.example.com'
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "pawan.agarwal-c@adityabirla.com",
        pass: "Modern@1234",
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: "pawan.agarwal-c@adityabirla.com",
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
