from django.db import models
from django.contrib.auth import get_user_model
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
    angry = models.FloatField(default=0)
    disgusted = models.FloatField(default=0)
    fearful = models.FloatField(default=0)
    happy = models.FloatField(default=0)
    neutral = models.FloatField(default=0)
    sad = models.FloatField(default=0)
    surprised = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    dominant = models.CharField(max_length=15, default="neutral")
    data = models.JSONField()
    
    def __str__(self):
        return str(self.title)


