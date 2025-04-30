from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'content', 'created_at', 'updated_at', 'active']
        read_only_fields = ['created_at', 'updated_at', 'author']
    
    def create(self, validated_data):
        # Set the author to the current user
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'author', 'content', 'publish_date', 
            'created_at', 'updated_at', 'status', 'comments'
        ]
        read_only_fields = ['created_at', 'updated_at', 'author']
    
    def create(self, validated_data):
        # Set the author to the current user
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data) 