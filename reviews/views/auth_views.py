from rest_framework import generics
from rest_framework.permissions import AllowAny

from ..serializers.auth_serializer import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    """
    API endpoint for registering a new user.
    """

    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]