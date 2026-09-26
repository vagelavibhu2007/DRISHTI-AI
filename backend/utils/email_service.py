import smtplib
import ssl
import logging
import datetime
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, List, Dict, Any
from backend.config import settings

logger = logging.getLogger("drishti.email")

# In-memory delivery audit trail
EMAIL_DELIVERY_LOGS: List[Dict[str, Any]] = []

def get_email_header_html(title: str = "CRITICAL INFRASTRUCTURE ALERT") -> str:
    """
    Renders standardized Government of India / DRISHTI AI header with national emblem and logo branding.
    """
    return f"""
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px; border-top: 5px solid #ef4444; text-align: center; border-radius: 12px 12px 0 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <td align="center" style="padding-bottom: 12px;">
                    <!-- Government stylized badge & emblem -->
                    <div style="display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 6px 16px; margin-bottom: 8px;">
                        <span style="color: #ffffff; font-size: 16px; margin-right: 6px;">🇮🇳</span>
                        <span style="color: #f8fafc; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Government of India</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td align="center">
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 900; margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: 0.5px;">
                        DRISHTI AI <span style="color: #38bdf8; font-weight: 400; font-size: 16px;">| Early Warning Radar</span>
                    </h1>
                    <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Predictive Infrastructure Risk & Milestone Intelligence
                    </p>
                </td>
            </tr>
        </table>
    </div>
    """

def get_email_footer_html() -> str:
    """
    Renders standardized footer with authority disclaimers and SLA timers.
    """
    return f"""
    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <p style="color: #64748b; font-size: 11px; margin: 0; line-height: 1.6;">
            <strong>DRISHTI AI Platform</strong> &bull; PM-GatiShakti &amp; PRAGATI Integrated Intelligence Node<br/>
            This is an automated high-priority AI early warning dispatch. Please do not reply directly to this mailbox.
        </p>
        <p style="color: #94a3b8; font-size: 10px; margin: 8px 0 0 0;">
            Generated on {datetime.datetime.utcnow().strftime("%d %B %Y, %H:%M:%S UTC")} &bull; Confidential &amp; Privileged
        </p>
    </div>
    """

def build_critical_project_email_html(project_data: Dict[str, Any], recipient_role: str = "Project Director & Designated Authority") -> str:
    """
    Generates a high-fidelity, comprehensive HTML brief for a critical infrastructure asset.
    """
    pid = project_data.get("projectId") or project_data.get("project_id", "701410")
    pname = project_data.get("projectName") or project_data.get("project_name", "Infrastructure Project")
    ministry = project_data.get("ministry", "Ministry of Road Transport & Highways")
    state = project_data.get("state", "National")
    sector = project_data.get("sector", "Infrastructure")
    
    overall_risk = float(project_data.get("overallRisk", project_data.get("overall_risk_score", 85.0)))
    cost_risk = float(project_data.get("costRisk", project_data.get("cost_overrun_probability", 88.0)))
    time_risk = float(project_data.get("timeRisk", project_data.get("time_overrun_probability", 82.0)))
    
    orig_cost = float(project_data.get("originalCost", project_data.get("original_cost_cr", 1500.0)))
    cum_exp = float(project_data.get("cumulativeExpenditure", project_data.get("cumulative_expenditure_cr", 1420.0)))
    phys_prog = float(project_data.get("physicalProgress", project_data.get("physical_progress_pct", 45.0)))
    exp_pct = float(project_data.get("expenditurePercentage", project_data.get("expenditure_pct_of_original_cost", (cum_exp / orig_cost) * 100 if orig_cost else 90.0)))
    delay_days = project_data.get("predicted_delay_days", int((100 - phys_prog) * 8.5))
    
    reason = project_data.get("reason", f"Expenditure reached {exp_pct:.1f}% while physical delivery is only {phys_prog:.1f}%. High predicted hazard of cost escalation.")
    recommendation = project_data.get("recommendation", "Enforce milestone-linked contractor escrow drawdown and schedule joint technical review.")

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>CRITICAL INFRASTRUCTURE ALERT - DRISHTI AI</title>
    </head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0;">
        <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0;">
            {get_email_header_html("CRITICAL PROJECT HAZARD DETECTED")}

            <div style="padding: 24px;">
                <!-- High Alert Badge Header -->
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td>
                                <span style="background-color: #ef4444; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.5px;">
                                    CRITICAL PRIORITY &bull; ACTION REQUIRED
                                </span>
                                <h2 style="color: #991b1b; font-size: 16px; margin: 8px 0 2px 0; font-weight: 800;">
                                    Immediate Risk Mitigation Brief
                                </h2>
                                <p style="color: #b91c1c; font-size: 12px; margin: 0;">
                                    Addressed To: <strong>{recipient_role}</strong>
                                </p>
                            </td>
                            <td align="right" style="vertical-align: top;">
                                <div style="background-color: #ffffff; border: 2px solid #ef4444; border-radius: 8px; padding: 6px 12px; text-align: center;">
                                    <span style="color: #64748b; font-size: 9px; text-transform: uppercase; font-weight: 700; display: block;">Overall Risk</span>
                                    <span style="color: #ef4444; font-size: 20px; font-weight: 900; font-family: monospace;">{overall_risk:.1f}%</span>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Project Identification Card -->
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 12px;">
                        <tr>
                            <td style="color: #64748b; padding-bottom: 6px; width: 30%;">Project Identifier:</td>
                            <td style="color: #0f172a; font-weight: 700; font-family: monospace; font-size: 13px; padding-bottom: 6px;">#{pid}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; padding-bottom: 6px;">Project Title:</td>
                            <td style="color: #0f172a; font-weight: 700; font-size: 13px; padding-bottom: 6px;">{pname}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; padding-bottom: 6px;">Nodal Ministry:</td>
                            <td style="color: #334155; font-weight: 600; padding-bottom: 6px;">{ministry}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b;">Jurisdiction:</td>
                            <td style="color: #334155; font-weight: 600;">{state} &bull; Sector: {sector}</td>
                        </tr>
                    </table>
                </div>

                <!-- Risk Metrics 3-Col Box -->
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 10px 0; font-weight: 800;">
                        AI Predictive Telemetry &amp; Financial Exposure
                    </h3>
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: separate; border-spacing: 8px 0;">
                        <tr>
                            <td width="33%" style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 8px; padding: 12px; text-align: center;">
                                <span style="color: #e11d48; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block;">Cost Overrun</span>
                                <span style="color: #be123c; font-size: 18px; font-weight: 900; font-family: monospace; margin: 4px 0; display: block;">{cost_risk:.1f}%</span>
                                <span style="color: #881337; font-size: 10px;">Probable Budget Breach</span>
                            </td>
                            <td width="33%" style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 12px; text-align: center;">
                                <span style="color: #ea580c; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block;">Schedule Drift</span>
                                <span style="color: #c2410c; font-size: 18px; font-weight: 900; font-family: monospace; margin: 4px 0; display: block;">{time_risk:.1f}%</span>
                                <span style="color: #7c2d12; font-size: 10px;">+{delay_days} Days Delay Est.</span>
                            </td>
                            <td width="33%" style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; padding: 12px; text-align: center;">
                                <span style="color: #16a34a; font-size: 10px; font-weight: 700; text-transform: uppercase; display: block;">Progress vs Spend</span>
                                <span style="color: #15803d; font-size: 18px; font-weight: 900; font-family: monospace; margin: 4px 0; display: block;">{phys_prog:.1f}% / {exp_pct:.1f}%</span>
                                <span style="color: #14532d; font-size: 10px;">₹{cum_exp:,.1f} Cr Spent</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- AI Explainability Drivers Box -->
                <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px; border-radius: 6px; margin-bottom: 20px;">
                    <h4 style="color: #0369a1; font-size: 12px; font-weight: 800; margin: 0 0 6px 0; text-transform: uppercase;">
                        Key Hazard Trigger:
                    </h4>
                    <p style="color: #334155; font-size: 12px; line-height: 1.5; margin: 0;">
                        {reason}
                    </p>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">
                        <span style="color: #0369a1; font-size: 11px; font-weight: 700;">Recommended AI Mitigation: </span>
                        <span style="color: #1e293b; font-size: 11px;">{recommendation}</span>
                    </div>
                </div>

                <!-- 72-Hour Escalation Warning Notice -->
                <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="24" style="vertical-align: top; padding-right: 10px;">
                                <span style="font-size: 16px;">⏱️</span>
                            </td>
                            <td>
                                <strong style="color: #92400e; font-size: 12px; display: block;">SLA Response Window &bull; 48–72 Hours</strong>
                                <span style="color: #b45309; font-size: 11px; line-height: 1.4;">
                                    If mitigation action is not acknowledged on the portal within 72 hours (3 days), this alert will automatically trigger a <strong>Tier-2 Hard Escalation</strong> directly to the Central Authority &amp; Ministry Secretary.
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Action CTA Button -->
                <div style="text-align: center; margin-bottom: 10px;">
                    <a href="http://localhost:3000/alerts" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                        Acknowledge Alert &amp; Log Mitigation Plan &rarr;
                    </a>
                </div>
            </div>

            {get_email_footer_html()}
        </div>
    </body>
    </html>
    """

def build_state_digest_email_html(state_name: str, critical_projects: List[Dict[str, Any]]) -> str:
    """
    Generates an executive brief for a State Authority officer aggregating all critical high-risk projects.
    """
    total_crit = len(critical_projects)
    total_val = sum(float(p.get("originalCost", p.get("original_cost_cr", 1000.0))) for p in critical_projects)
    
    rows_html = ""
    for idx, p in enumerate(critical_projects[:8]):
        pid = p.get("projectId") or p.get("project_id", f"70{idx+100}")
        pname = p.get("projectName") or p.get("project_name", "Infrastructure Project")
        risk = float(p.get("overallRisk", p.get("overall_risk_score", 80.0)))
        phys = float(p.get("physicalProgress", p.get("physical_progress_pct", 40.0)))
        exp = float(p.get("expenditurePercentage", p.get("expenditure_pct_of_original_cost", 85.0)))
        cost = float(p.get("originalCost", p.get("original_cost_cr", 500.0)))

        rows_html += f"""
        <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
            <td style="padding: 10px 8px; font-family: monospace; font-weight: 700; color: #0f172a;">#{pid}</td>
            <td style="padding: 10px 8px; font-weight: 600; color: #1e293b;">
                {pname}
                <span style="display: block; font-size: 10px; color: #64748b; font-weight: normal;">₹{cost:,.1f} Cr Outlay</span>
            </td>
            <td style="padding: 10px 8px; text-align: center; color: #475569;">{phys:.1f}% / {exp:.1f}%</td>
            <td style="padding: 10px 8px; text-align: right;">
                <span style="background-color: #fee2e2; color: #b91c1c; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: monospace;">
                    {risk:.1f}%
                </span>
            </td>
        </tr>
        """

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>STATE CRITICAL INFRASTRUCTURE DIGEST - {state_name}</title>
    </head>
    <body style="background-color: #f1f5f9; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0;">
        <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #e2e8f0;">
            {get_email_header_html(f"STATE INFRASTRUCTURE RISK BRIEF: {state_name.upper()}")}

            <div style="padding: 24px;">
                <!-- Digest Summary Header -->
                <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 16px; border-radius: 6px; margin-bottom: 20px;">
                    <h2 style="color: #9a3412; font-size: 16px; margin: 0 0 4px 0; font-weight: 800;">
                        🏛️ {state_name} Jurisdictional Risk Executive Brief
                    </h2>
                    <p style="color: #c2410c; font-size: 12px; margin: 0;">
                        {total_crit} Critical High-Risk Assets Identified by AI Predictive Models
                    </p>
                </div>

                <!-- KPI Overview Grid -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                    <tr>
                        <td width="50%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-right: 8px;">
                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Critical Monitored Projects</span>
                            <span style="color: #0f172a; font-size: 22px; font-weight: 900; font-family: monospace;">{total_crit}</span>
                        </td>
                        <td width="50%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; display: block;">Combined Sanctioned Outlay</span>
                            <span style="color: #0f172a; font-size: 22px; font-weight: 900; font-family: monospace;">₹{total_val:,.1f} Cr</span>
                        </td>
                    </tr>
                </table>

                <!-- Projects Table -->
                <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="background-color: #f1f5f9; font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase;">
                                <th style="padding: 10px 8px;">ID</th>
                                <th style="padding: 10px 8px;">Project Title</th>
                                <th style="padding: 10px 8px; text-align: center;">Physical / Spend</th>
                                <th style="padding: 10px 8px; text-align: right;">AI Risk</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows_html}
                        </tbody>
                    </table>
                </div>

                <!-- Portal Action -->
                <div style="text-align: center;">
                    <a href="http://localhost:3000/projects" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; letter-spacing: 0.5px;">
                        Open State Risk Command Center &rarr;
                    </a>
                </div>
            </div>

            {get_email_footer_html()}
        </div>
    </body>
    </html>
    """

def send_email_async(
    to_email: str,
    subject: str,
    html_content: str,
    cc_emails: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Executes asynchronous or synchronous email transmission with fallback logging.
    Guarantees fast non-blocking return while attempting real SMTP delivery if credentials are provided.
    """
    target_recipient = to_email or settings.ALERT_RECIPIENT_EMAIL or "hardgamer7000@gmail.com"
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    msg_id = f"MSG-DRISHTI-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}"

    log_entry = {
        "messageId": msg_id,
        "recipient": target_recipient,
        "cc": cc_emails or [],
        "subject": subject,
        "timestamp": timestamp,
        "status": "QUEUED",
        "method": "SMTP" if (settings.SMTP_USER and settings.SMTP_PASSWORD) else "SIMULATED_LOCAL_DISPATCH",
        "delivered": False
    }

    def _dispatch_worker():
        try:
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                # Real SMTP delivery via Gmail / custom host
                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
                msg["To"] = target_recipient
                if cc_emails:
                    msg["Cc"] = ", ".join(cc_emails)
                msg["Message-ID"] = f"<{msg_id}@drishti-ai.gov.in>"

                part_html = MIMEText(html_content, "html")
                msg.attach(part_html)

                context = ssl.create_default_context()
                with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                    if settings.SMTP_TLS:
                        server.starttls(context=context)
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                    all_recipients = [target_recipient] + (cc_emails or [])
                    server.sendmail(settings.SMTP_FROM_EMAIL, all_recipients, msg.as_string())

                log_entry["status"] = "DELIVERED_VIA_SMTP"
                log_entry["delivered"] = True
                logger.info(f"Live SMTP email delivered successfully to {target_recipient} (Subject: {subject})")
            else:
                # High-speed local delivery simulator
                log_entry["status"] = "DELIVERED_TEST_MODE"
                log_entry["delivered"] = True
                logger.info(f"[DRISHTI AI EMAIL SIMULATOR] Email successfully routed to {target_recipient} (Subject: {subject})")
        except Exception as exc:
            log_entry["status"] = "FAILED"
            log_entry["error"] = str(exc)
            log_entry["delivered"] = False
            logger.error(f"Email dispatch error for {target_recipient}: {str(exc)}")

    # Run dispatch in a background thread to guarantee zero latency to API caller
    worker_thread = threading.Thread(target=_dispatch_worker, daemon=True)
    worker_thread.start()

    EMAIL_DELIVERY_LOGS.insert(0, log_entry)
    if len(EMAIL_DELIVERY_LOGS) > 100:
        EMAIL_DELIVERY_LOGS.pop()

    return {
        "success": True,
        "messageId": msg_id,
        "recipient": target_recipient,
        "subject": subject,
        "status": "DISPATCHED",
        "timestamp": timestamp,
        "details": "Alert email queued and dispatched asynchronously."
    }

