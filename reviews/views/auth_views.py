from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..serializers.auth_serializer import (
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
        from django.contrib.auth.models import User
        return User.objects.select_related("profile", "settings").get(id=self.request.user.id)