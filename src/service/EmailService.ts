import { mailTransporter } from "../config/mailConfig";
import { Resend } from 'resend';

export type DeliveryEmailParams = {
    link: string;
    clientName: string;
    projectName: string;
    deliveryVersion: number;
    deliveryTitle: string;
    freelancerName: string;
};

function renderDeliveryEmailHTML(p: DeliveryEmailParams) {
    const {
        link, clientName, projectName, deliveryVersion, deliveryTitle, freelancerName,
    } = p;

    return `
  <!doctype html>
  <html lang="pt-BR">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Nova entrega disponível</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f8fafc;">
    <div style="font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height:1.6; color:#374151; max-width:600px; margin:0 auto; background-color:#f8fafc;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#9333ea 0%,#ec4899 100%); padding:32px 24px; text-align:center;">
        <div style="display:flex; align-items:center; justify-content:center; margin-bottom:16px;">
          <div style="width:32px; height:32px; background-color:rgba(255,255,255,0.2); border-radius:8px; display:flex; align-items:center; justify-content:center; margin-right:12px;">
            <span style="color:#ffffff; font-size:18px;">🎨</span>
          </div>
          <h1 style="color:#ffffff; font-size:24px; font-weight:bold; margin:0;">Freelog</h1>
        </div>
        <p style="color:rgba(255,255,255,0.9); font-size:16px; margin:0;">Nova entrega disponível para revisão</p>
      </div>

      <!-- Main Content -->
      <div style="background-color:#ffffff; padding:32px 24px;">
        <div style="text-align:center; margin-bottom:32px;">
          <div style="width:64px; height:64px; background-color:#f3e8ff; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; border:3px solid #e879f9;">
            <span style="font-size:24px;">📦</span>
          </div>
          <h2 style="color:#581c87; font-size:28px; font-weight:bold; margin:0 0 8px 0;">Entrega Pronta!</h2>
          <p style="color:#7c3aed; font-size:16px; margin:0;">Olá ${clientName}, seu projeto foi atualizado</p>
        </div>

        <!-- Project Info Card -->
        <div style="background-color:#faf5ff; border:1px solid #e879f9; border-radius:12px; padding:24px; margin-bottom:24px;">
          <h3 style="color:#581c87; font-size:18px; font-weight:600; margin:0 0 16px 0; display:flex; align-items:center;">
            <span style="margin-right:8px;">📋</span>
            Detalhes da Entrega
          </h3>

          <div style="margin-bottom:12px;">
            <strong style="color:#7c3aed;">Projeto:</strong>
            <span style="margin-left:8px; color:#374151;">${projectName}</span>
          </div>

          <div style="margin-bottom:12px;">
            <strong style="color:#7c3aed;">Versão:</strong>
            <span style="margin-left:8px; background-color:#ddd6fe; color:#5b21b6; padding:2px 8px; border-radius:12px; font-size:14px; font-weight:500;">${deliveryVersion}</span>
          </div>

          <div style="margin-bottom:12px;">
            <strong style="color:#7c3aed;">Título:</strong>
            <span style="margin-left:8px; color:#374151;">${deliveryTitle}</span>
          </div>

          <div>
            <strong style="color:#7c3aed;">Freelancer:</strong>
            <span style="margin-left:8px; color:#374151;">${freelancerName}</span>
          </div>
        </div>

        <!-- Description -->
        <div style="margin-bottom:32px;">
          <p style="color:#4b5563; font-size:16px; line-height:1.6; margin:0 0 16px 0;">
            Uma nova versão do seu projeto está disponível para revisão. Você pode visualizar todos os arquivos, deixar comentários e aprovar ou solicitar alterações diretamente na plataforma.
          </p>

          <div style="background-color:#fef3c7; border:1px solid #f59e0b; border-radius:8px; padding:12px 16px; display:flex; align-items:center;">
            <span style="margin-right:8px; font-size:16px;">⏰</span>
            <small style="color:#92400e; font-size:14px;">Este link expira em 24 horas por motivos de segurança.</small>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center; margin-bottom:32px;">
          <a href="${link}"
             style="display:inline-block; background:linear-gradient(135deg,#9333ea 0%,#ec4899 100%); color:#ffffff; text-decoration:none; padding:16px 32px; border-radius:12px; font-size:16px; font-weight:600; box-shadow:0 4px 12px rgba(147,51,234,0.3);">
            <span style="margin-right:8px;">👁️</span>
            Revisar Entrega
          </a>
        </div>

        <!-- Alternative Link -->
        <div style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:24px;">
          <p style="color:#64748b; font-size:14px; margin:0 0 8px 0;">Ou copie e cole este link no seu navegador:</p>
          <code style="background-color:#f1f5f9; color:#475569; padding:8px 12px; border-radius:6px; font-size:13px; word-break:break-all; display:block; border:1px solid #cbd5e1;">
            ${link}
          </code>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f8fafc; padding:24px; text-align:center; border-top:1px solid #e5e7eb;">
        <div style="margin-bottom:16px;">
          <div style="display:flex; align-items:center; justify-content:center; margin-bottom:8px;">
            <span style="margin-right:8px; font-size:16px;">🎨</span>
            <span style="color:#581c87; font-size:16px; font-weight:600;">Freelog</span>
          </div>
          <p style="color:#6b7280; font-size:14px; margin:0;">CRM para Freelancers Criativos</p>
        </div>

        <div style="border-top:1px solid #d1d5db; padding-top:16px;">
          <p style="color:#9ca3af; font-size:12px; margin:0 0 8px 0;">Você está recebendo este email porque é cliente de um projeto no Freelog.</p>
          <p style="color:#9ca3af; font-size:12px; margin:0;">© 2025 Freelog. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `.trim();
}

export class EmailService {
    static async sendDeliveryEmail(to: string, params: DeliveryEmailParams) {
        const subject = `Entrega do seu projeto — ${params.deliveryTitle} (v${params.deliveryVersion})`;

        const resend = new Resend('re_E3Ax9UBP_FcQoCTSma9BrNJvBmAz64aVY');
        await resend.emails.send({
            from: 'no_reply@freelog.app',
            to,
            subject: subject,
            html: renderDeliveryEmailHTML(params)
        });
    }
}
