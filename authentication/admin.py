from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your custom User model with the admin site
@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Fields to display in the user list
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    
    # Fields to filter users by in the sidebar
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    
    # Fields to search by
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # Order users by most recently joined
    ordering = ('-date_joined',)
    
    # Fieldsets for the user detail page
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Custom fieldsets for adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )