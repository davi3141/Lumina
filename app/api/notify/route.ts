import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { taskTitle, dueDate, recipientEmail } = body;

    const apiKey = process.env.RESEND_API_KEY;

    // Se a chave do Resend estiver configurada no .env.local, faz a chamada real via fetch à API do Resend
    if (apiKey && apiKey.startsWith("re_") && !apiKey.includes("demo")) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.NOTIFICATION_FROM_EMAIL || "Lumina <onboarding@resend.dev>",
          to: recipientEmail || "aluno@universidade.edu",
          subject: `⏰ Alerta de Prazo: ${taskTitle}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #fafafa;">
              <h1 style="color: #1d1d1f; font-size: 22px; font-weight: 600; margin-bottom: 8px;">Aviso de Prazo Lumina</h1>
              <p style="color: #666; font-size: 14px; margin-top: 0;">Você possui uma entrega agendada para breve na sua sala de aula.</p>
              
              <div style="background-color: #ffffff; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #ebebeb;">
                <p style="margin: 0; font-size: 15px; font-weight: 600; color: #0071e3;">${taskTitle}</p>
                <p style="margin: 6px 0 0 0; font-size: 13px; color: #888;">Data Limite: ${new Date(dueDate).toLocaleString("pt-BR")}</p>
              </div>

              <a href="https://lumina-study.vercel.app/tasks" style="display: inline-block; background-color: #0071e3; color: #ffffff; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: 500;">Ver no Mural de Tarefas</a>
              
              <p style="font-size: 11px; color: #aaa; margin-top: 24px;">Lumina Education • 100% Free Tier Architecture</p>
            </div>
          `,
        }),
      });

      const data = await res.json();
      return NextResponse.json({ success: true, resendResponse: data });
    }

    // Modo simulação caso a chave ainda não tenha sido cadastrada pelo usuário
    return NextResponse.json({
      success: true,
      simulated: true,
      message: `E-mail de notificação gerado para o prazo "${taskTitle}" (${dueDate}). Cadastre sua chave em RESEND_API_KEY no .env.local para envios reais.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Erro ao processar notificação" },
      { status: 500 }
    );
  }
}
