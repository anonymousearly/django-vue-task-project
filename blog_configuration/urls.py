from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'blog_configuration'

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'posts', views.PostViewSet, basename='post')
router.register(r'comments', views.CommentViewSet, basename='comment')

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
] 