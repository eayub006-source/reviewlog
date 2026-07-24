from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReviewViewSet,
    RegisterView,
    PublicReviewList,
    ProfileView,
)

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("public-reviews/", PublicReviewList.as_view(), name="public-reviews"),
    path("", include(router.urls)),
]
