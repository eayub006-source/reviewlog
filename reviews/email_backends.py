"""Email backends that don't depend on outbound SMTP.

Render's free tier blocks all outbound traffic to SMTP ports (25/465/587),
so any socket-based backend (Gmail SMTP included) can never deliver mail
from a free Render service, regardless of how correctly it's configured.
Resend's API is a normal HTTPS POST (port 443), which isn't affected by
that block.
"""
import json
import urllib.error
import urllib.request

from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend


class ResendApiEmailBackend(BaseEmailBackend):
    """Sends mail via Resend's HTTPS API instead of raw SMTP."""

    API_URL = "https://api.resend.com/emails"

    def send_messages(self, email_messages):
        if not email_messages:
            return 0

        api_key = getattr(settings, "RESEND_API_KEY", "")
        if not api_key:
            if self.fail_silently:
                return 0
            raise ValueError("RESEND_API_KEY is not configured.")

        timeout = getattr(settings, "EMAIL_TIMEOUT", 10)
        sent_count = 0

        for message in email_messages:
            payload = {
                "from": message.from_email,
                "to": list(message.to),
                "subject": message.subject,
                "text": message.body,
            }
            request = urllib.request.Request(
                self.API_URL,
                data=json.dumps(payload).encode("utf-8"),
                method="POST",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )
            try:
                with urllib.request.urlopen(request, timeout=timeout) as response:
                    if 200 <= response.status < 300:
                        sent_count += 1
                    elif not self.fail_silently:
                        raise RuntimeError(f"Resend API returned unexpected status {response.status}")
            except urllib.error.HTTPError as exc:
                if not self.fail_silently:
                    detail = exc.read().decode("utf-8", errors="replace")
                    raise RuntimeError(f"Resend API rejected the request ({exc.code}): {detail}") from exc
            except urllib.error.URLError as exc:
                if not self.fail_silently:
                    raise RuntimeError(f"Could not reach the Resend API: {exc.reason}") from exc

        return sent_count
