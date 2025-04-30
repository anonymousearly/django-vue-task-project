from django.contrib import admin
from .models import Post, Comment

class CommentInline(admin.TabularInline):
    model = Comment
    extra = 1
    raw_id_fields = ['author']

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publish_date', 'status')
    list_filter = ('status', 'created_at', 'publish_date', 'author')
    search_fields = ('title', 'content')
    date_hierarchy = 'publish_date'
    ordering = ('-publish_date',)
    inlines = [CommentInline]
    raw_id_fields = ['author']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'post', 'created_at', 'active')
    list_filter = ('active', 'created_at', 'updated_at')
    search_fields = ('author__username', 'content')
    raw_id_fields = ['author', 'post']
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.author = request.user
        super().save_model(request, obj, form, change)
