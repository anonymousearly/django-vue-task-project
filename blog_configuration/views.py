from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, generics, permissions, filters
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer

# Create your views here.

# Post ViewSets
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint for posts
    Allows CRUD operations on blog posts
    """
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'author__username']
    search_fields = ['title', 'content']
    ordering_fields = ['publish_date', 'created_at', 'title']

    def get_queryset(self):
        """
        Filter published posts for authenticated users
        Staff users can see all posts
        Authors can see their own draft posts
        """
        user = self.request.user
        if user.is_staff:
            return Post.objects.all()
        else:
            return Post.objects.filter(status='published') | Post.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        post = self.get_object()
        if self.request.user != post.author and not self.request.user.is_staff:
            raise PermissionDenied("You don't have permission to edit this post")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author and not self.request.user.is_staff:
            raise PermissionDenied("You don't have permission to delete this post")
        instance.delete()

# Comment ViewSets
class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint for comments
    Allows CRUD operations on comments
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['post', 'author', 'active']
    ordering_fields = ['created_at']

    def get_queryset(self):
        """
        Filter active comments for authenticated users
        Staff users can see all comments
        Authors can see their own inactive comments
        """
        user = self.request.user
        if user.is_staff:
            return Comment.objects.all()
        else:
            return Comment.objects.filter(active=True) | Comment.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        comment = self.get_object()
        if self.request.user != comment.author and not self.request.user.is_staff:
            raise PermissionDenied("You don't have permission to edit this comment")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author and not self.request.user.is_staff:
            raise PermissionDenied("You don't have permission to delete this comment")
        instance.delete()
