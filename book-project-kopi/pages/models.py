from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class Emotion_data(models.Model):
    title = models.CharField(max_length=150, default='Testing1', unique=True)
    faces = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    angry = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    disgusted = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fearful = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    happy = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    neutral = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sad = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    surprised = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.title

class Pulse_data(models.Model):
    title = models.CharField(max_length=150, default='Testing2', unique=True)
    avg_pulse = models.DecimalField(max_digits=5, decimal_places=2, default=0)


    def __str__(self):
        return self.title
