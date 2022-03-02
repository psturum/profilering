from django.db import models
from django.contrib.auth.models import AbstractUser
from pages.models import Emotion_data


# Create your models here.
class CustomUser(AbstractUser):
    skole = models.CharField(max_length=20)
    emotion_data = models.OneToOneField(
        Emotion_data,
        on_delete=models.CASCADE,
        null=True,
        blank=True
        )

    def __str__(self):
        return f"{self.username} {self.email}"

