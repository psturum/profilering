from django.db import models
from django.contrib.auth import get_user_model
from picklefield.fields import PickledObjectField
from django.contrib.postgres.fields import ArrayField
# from csvImporter.model import CsvModel

class Emotion_data(models.Model):
    title = models.IntegerField(default=0)
    created_by = models.ForeignKey(
    get_user_model(),
    null=True,
    on_delete=models.CASCADE,)
    age = models.IntegerField(default=0)
    gender = models.CharField(max_length=15, default="n/a")
    faces = models.IntegerField(default=0)
    angry = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    disgusted = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fearful = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    happy = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    neutral = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sad = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    surprised = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    dominant = models.CharField(max_length=15, default="neutral")
    data = PickledObjectField()
    
    def __str__(self):
        return str(self.title)

class Gaze_data(models.Model):
    title = models.CharField(max_length=150, default='Testing2', unique=True)
    created_by = models.ForeignKey(
    get_user_model(),
    null=True,
    on_delete=models.CASCADE,)
    up = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    screen = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    down = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    size = models.DecimalField(max_digits=5, decimal_places=2, default=0)


    def __str__(self):
        return self.title

