import io
from unittest.mock import MagicMock, patch
from urllib.error import HTTPError

from django.core.mail import EmailMessage
from django.test import TestCase, override_settings

from .email_backends import ResendApiEmailBackend

FAKE_API_KEY = "test-key-not-a-real-secret"


def _make_message():
    return EmailMessage(
        subject="Test",
        body="Test body",
        from_email="onboarding@resend.dev",
        to=["someone@example.com"],
    )


@override_settings(RESEND_API_KEY=FAKE_API_KEY, EMAIL_TIMEOUT=5)
class ResendApiEmailBackendTests(TestCase):
    @patch("reviews.email_backends.urllib.request.urlopen")
    def test_request_includes_identifiable_user_agent(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.status = 200
        mock_urlopen.return_value.__enter__.return_value = mock_response

        ResendApiEmailBackend().send_messages([_make_message()])

        sent_request = mock_urlopen.call_args[0][0]
        self.assertEqual(sent_request.get_header("User-agent"), ResendApiEmailBackend.USER_AGENT)
        self.assertNotIn("Python-urllib", sent_request.get_header("User-agent"))

    @patch("reviews.email_backends.urllib.request.urlopen")
    def test_successful_request_reports_one_message_sent(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.status = 200
        mock_urlopen.return_value.__enter__.return_value = mock_response

        result = ResendApiEmailBackend().send_messages([_make_message()])

        self.assertEqual(result, 1)

    @patch("reviews.email_backends.urllib.request.urlopen")
    def test_403_from_resend_raises_runtime_error(self, mock_urlopen):
        error_body = b'{"statusCode":403,"message":"error code: 1010"}'
        mock_urlopen.side_effect = HTTPError(
            url=ResendApiEmailBackend.API_URL,
            code=403,
            msg="Forbidden",
            hdrs=None,
            fp=io.BytesIO(error_body),
        )

        with self.assertRaises(RuntimeError) as ctx:
            ResendApiEmailBackend().send_messages([_make_message()])

        self.assertIn("403", str(ctx.exception))

    @patch("reviews.email_backends.urllib.request.urlopen")
    def test_api_key_only_appears_in_authorization_header(self, mock_urlopen):
        mock_response = MagicMock()
        mock_response.status = 200
        mock_urlopen.return_value.__enter__.return_value = mock_response

        ResendApiEmailBackend().send_messages([_make_message()])

        sent_request = mock_urlopen.call_args[0][0]
        self.assertIn(FAKE_API_KEY, sent_request.get_header("Authorization"))
        # The key must never end up in the request body, the URL, or any
        # other header - only the Authorization header should carry it.
        self.assertNotIn(FAKE_API_KEY, sent_request.data.decode("utf-8"))
        self.assertNotIn(FAKE_API_KEY, sent_request.full_url)

    @patch("reviews.email_backends.urllib.request.urlopen")
    def test_403_error_message_never_contains_the_api_key(self, mock_urlopen):
        error_body = b'{"statusCode":403,"message":"error code: 1010"}'
        mock_urlopen.side_effect = HTTPError(
            url=ResendApiEmailBackend.API_URL,
            code=403,
            msg="Forbidden",
            hdrs=None,
            fp=io.BytesIO(error_body),
        )

        with self.assertRaises(RuntimeError) as ctx:
            ResendApiEmailBackend().send_messages([_make_message()])

        self.assertNotIn(FAKE_API_KEY, str(ctx.exception))

    @override_settings(RESEND_API_KEY="")
    def test_missing_api_key_fails_fast_without_a_network_call(self):
        with patch("reviews.email_backends.urllib.request.urlopen") as mock_urlopen:
            with self.assertRaises(ValueError):
                ResendApiEmailBackend().send_messages([_make_message()])
            mock_urlopen.assert_not_called()
