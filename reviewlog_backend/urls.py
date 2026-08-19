from django.contrib import admin
from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView

from reviews.views import EmailOrUsernameTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # JWT Authentication (accepts username OR email in the same field)
    path('api/token/', EmailOrUsernameTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Reviews API
    path('api/', include('reviews.urls')),
]
