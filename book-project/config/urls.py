
from django.contrib import admin
from django.urls import path, include
from django.conf import settings

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User management
    path('accounts/', include('allauth.urls')),

    # Local apps
    path('', include('pages.urls')),
    # path('books/', include('books.urls')),
]
