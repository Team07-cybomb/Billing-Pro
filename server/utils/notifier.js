import dotenv from "dotenv";
dotenv.config(); // ✅ Make sure environment variables load first

import nodemailer from "nodemailer";
import { Server } from "socket.io";

// ✅ Create Nodemailer transporter (Hostinger SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  family: 4, // ✅ Force IPv4 to avoid ::1 IPv6 localhost errors
  connectionTimeout: 20000, // Optional: prevent hanging connections
});

// Log SMTP connection details for debugging
console.log("📧 SMTP Transporter Configured:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
});

// ✅ Initialize Socket.io
let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("⚡ User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });
};

// ✅ Generic email sender
const sendEmail = async (mailOptions) => {
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [EMAIL SENT] to ${mailOptions.to}: ${info.messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${mailOptions.to}:`, error);
  }
};

// ✅ Bootstrap-based email template
const createBootstrapEmail = (title, content, button = null) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <title>${title}</title>
    <style>
        .email-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .email-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            overflow: hidden;
            max-width: 600px;
            margin: 0 auto;
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .email-body {
            padding: 40px 30px;
        }
        .ticket-card {
            border-left: 4px solid #667eea;
            background: #f8f9fa;
        }
        .detail-row {
            border-bottom: 1px solid #e9ecef;
            padding: 12px 0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .status-badge {
            font-size: 0.8em;
            padding: 6px 12px;
            border-radius: 20px;
        }
        .footer {
            background: #f8f9fa;
            padding: 25px;
            text-align: center;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-card">
            <div class="email-header">
                <h1 class="display-6 fw-bold mb-3"><i class="fas fa-ticket-alt me-2"></i>${title}</h1>
                <p class="mb-0 opacity-75">Support Ticket System</p>
            </div>
            
            <div class="email-body">
                ${content}
                
                ${button ? `
                <div class="text-center mt-4">
                    <a href="${button.url}" class="btn btn-primary btn-lg px-5">
                        <i class="${button.icon} me-2"></i>${button.text}
                    </a>
                </div>
                ` : ''}
            </div>
            
            <div class="footer">
                <p class="mb-2"><i class="fas fa-shield-alt me-2"></i>Secure Ticket Management System</p>
                <p class="small mb-0">&copy; ${new Date().getFullYear()} Support Team. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

// ✅ Send email to admin when a new ticket is created
export const sendNewTicketEmail = async (ticket) => {
  const content = `
    <div class="alert alert-info border-0">
        <div class="d-flex align-items-center">
            <i class="fas fa-bell fa-2x me-3"></i>
            <div>
                <h4 class="alert-heading mb-1">New Support Ticket Alert!</h4>
                <p class="mb-0">A new support ticket has been submitted and requires your attention.</p>
            </div>
        </div>
    </div>

    <div class="card ticket-card border-0 shadow-sm mb-4">
        <div class="card-body">
            <div class="row align-items-center mb-3">
                <div class="col">
                    <h3 class="card-title text-primary mb-1">
                        <i class="fas fa-file-alt me-2"></i>${ticket.subject}
                    </h3>
                    <span class="badge bg-primary status-badge">Ticket #${ticket.ticketId}</span>
                </div>
                <div class="col-auto">
                    <span class="badge bg-warning status-badge">
                        <i class="fas fa-clock me-1"></i>New
                    </span>
                </div>
            </div>

            <div class="detail-row">
                <div class="row">
                    <div class="col-sm-4 fw-bold text-muted">
                        <i class="fas fa-user me-2"></i>Submitted By:
                    </div>
                    <div class="col-sm-8">
                        ${ticket.customerName} (${ticket.customerEmail})
                    </div>
                </div>
            </div>

            <div class="detail-row">
                <div class="row">
                    <div class="col-sm-4 fw-bold text-muted">
                        <i class="fas fa-building me-2"></i>Department:
                    </div>
                    <div class="col-sm-8">
                        <span class="badge bg-info">${ticket.department}</span>
                    </div>
                </div>
            </div>

            <div class="detail-row">
                <div class="row">
                    <div class="col-sm-4 fw-bold text-muted">
                        <i class="fas fa-envelope me-2"></i>Message:
                    </div>
                    <div class="col-sm-8">
                        <div class="card bg-light">
                            <div class="card-body">
                                <p class="card-text">${ticket.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alert alert-light border text-center">
        <i class="fas fa-exclamation-circle text-warning me-2"></i>
        <strong>Action Required:</strong> Please log in to the admin portal to review and respond to this ticket.
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: [process.env.ADMIN_EMAIL, process.env.BILLING_EMAIL].filter(Boolean),
    subject: `🚨 New Support Ticket: ${ticket.subject} (ID: ${ticket.ticketId})`,
    html: createBootstrapEmail(
      "New Ticket Alert",
      content,
      {
        text: "View Ticket",
        icon: "fas fa-external-link-alt",
        url: `${process.env.ADMIN_PORTAL_URL || '#'}/tickets/${ticket.ticketId}`
      }
    ),
  };

  await sendEmail(mailOptions);
};

// ✅ Send confirmation email to customer/staff
export const sendStaffConfirmationEmail = async (ticket) => {
  const content = `
    <div class="text-center mb-4">
        <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
        <h2 class="mt-3 text-success">Ticket Received!</h2>
        <p class="lead">Thank you for contacting our support team. We've received your ticket and will get back to you shortly.</p>
    </div>

    <div class="card border-success shadow-sm mb-4">
        <div class="card-header bg-success text-white">
            <h4 class="mb-0"><i class="fas fa-ticket-alt me-2"></i>Your Ticket Details</h4>
        </div>
        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-hashtag text-primary me-3 fa-lg"></i>
                        <div>
                            <small class="text-muted">Ticket ID</small>
                            <div class="fw-bold">${ticket.ticketId}</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-building text-primary me-3 fa-lg"></i>
                        <div>
                            <small class="text-muted">Department</small>
                            <div class="fw-bold">${ticket.department}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <div class="d-flex align-items-start mb-3">
                    <i class="fas fa-tag text-primary me-3 mt-1 fa-lg"></i>
                    <div class="flex-grow-1">
                        <small class="text-muted">Subject</small>
                        <div class="fw-bold">${ticket.subject}</div>
                    </div>
                </div>
            </div>

            <div class="mb-3">
                <div class="d-flex align-items-start">
                    <i class="fas fa-comment text-primary me-3 mt-1 fa-lg"></i>
                    <div class="flex-grow-1">
                        <small class="text-muted">Your Message</small>
                        <div class="card bg-light mt-1">
                            <div class="card-body">
                                <p class="mb-0">${ticket.message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="alert alert-info border-0">
        <div class="d-flex">
            <i class="fas fa-info-circle fa-2x me-3 mt-1"></i>
            <div>
                <h5 class="alert-heading">What happens next?</h5>
                <p class="mb-2">Our support team will review your ticket and respond within 24 hours.</p>
                <p class="mb-0">You'll receive email notifications when there are updates to your ticket.</p>
            </div>
        </div>
    </div>

    <div class="card border-0 bg-light">
        <div class="card-body text-center">
            <h6 class="card-title"><i class="fas fa-clock me-2"></i>Expected Response Time</h6>
            <p class="card-text mb-0">
                <span class="badge bg-success">Within 24 Hours</span>
            </p>
        </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: ticket.customerEmail,
    subject: `✅ Ticket Received: ${ticket.subject} (ID: ${ticket.ticketId})`,
    html: createBootstrapEmail(
      "Ticket Confirmation",
      content
    ),
  };

  await sendEmail(mailOptions);
};

// ✅ Emit socket notification for new ticket
export const emitNewTicketNotification = (ticket) => {
  if (io) {
    io.emit("newTicket", {
      message: `A new ticket (${ticket.ticketId}) has been created by ${ticket.customerName}.`,
      ticket,
    });
    console.log(`[SOCKET EMITTED] New ticket notification for ${ticket.ticketId}`);
  } else {
    console.warn("⚠️ Socket.io not initialized. Cannot emit notification.");
  }
};