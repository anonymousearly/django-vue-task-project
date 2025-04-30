from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Additional fields can be added here as needed.
    """
    email = models.EmailField(unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
