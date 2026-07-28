from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, AllowAny

from ..models import Review
from ..serializers import ReviewSerializer
from ..permissions import IsOwner


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsOwner()]
        return [IsAuthenticated()]

    def get_queryset(self):
        return Review.objects.filter(user=self.request.user).order_by("-date")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PublicReviewList(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Review.objects.filter(is_public=True).order_by("-date")