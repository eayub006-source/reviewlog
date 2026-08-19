import logging

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from ..serializers.auth_serializer import (
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for registering a new user.
    """
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating the logged-in user's profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return User.objects.select_related("profile", "settings").get(id=self.request.user.id)


class EmailOrUsernameTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Allows the existing JWT login endpoint to accept a username OR an email
    address in the same field, without introducing a second auth system."""

    def validate(self, attrs):
        login_value = attrs.get(self.username_field, "")

        if login_value and "@" in login_value:
            try:
                matched_user = User.objects.get(email__iexact=login_value)
            except (User.DoesNotExist, User.MultipleObjectsReturned):
                matched_user = None

            if matched_user is not None:
                attrs[self.username_field] = matched_user.get_username()

        return super().validate(attrs)


class EmailOrUsernameTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenObtainPairSerializer


_password_reset_token_generator = PasswordResetTokenGenerator()
logger = logging.getLogger(__name__)


class PasswordResetRequestView(APIView):
    """
    Starts a password reset. Always returns the same generic response
    whether or not the email is registered, so the endpoint cannot be used
    to enumerate accounts.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        user = User.objects.filter(email__iexact=email).first()
        if user is not None:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = _password_reset_token_generator.make_token(user)
            reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"

            try:
                send_mail(
                    subject="Reset your ReviewLog password",
                    message=(
                        "We received a request to reset your ReviewLog password.\n\n"
                        f"Reset it here: {reset_url}\n\n"
                        "If you did not request this, you can safely ignore this email."
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )
            except Exception:
                # Never leak delivery failures to the client (that would be an
                # enumeration signal); log server-side so misconfiguration is
                # still visible in Render's logs.
                logger.exception("Failed to send password reset email")

        return Response(
            {"detail": "If an account with that email exists, a password reset link has been sent."},
            status=status.HTTP_200_OK,
        )


class PasswordResetConfirmView(APIView):
    """Completes a password reset given a uid/token pair from the emailed link."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            user_id = force_str(urlsafe_base64_decode(data["uid"]))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            user = None

        if user is None or not _password_reset_token_generator.check_token(user, data["token"]):
            return Response(
                {"detail": "This password reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(data["new_password"])
        user.save()

        return Response({"detail": "Your password has been reset. You can now log in."}, status=status.HTTP_200_OK)
