from rest_framework.routers import DefaultRouter
from .views.review_views import ReviewViewSet

router = DefaultRouter()
router.register(r"reviews", ReviewViewSet)

urlpatterns = router.urls