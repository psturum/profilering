from django import forms
from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    

    skole = models.CharField(max_length=20, default="n/a")
    fag = models.CharField(max_length=20, default="n/a")
    alder = models.IntegerField(default=0)
    køn = models.CharField(max_length=10, default="n/a")
    koncentrationsevne = models.CharField(max_length=10, default="n/a")
    sidste_humør = models.CharField(max_length=10, default="n/a")
    avg_humør = models.CharField(max_length=10, default="n/a")
    it_færdighed = models.CharField(max_length=10, default="n/a")
    reklame = models.IntegerField(default=1)
    
    def __str__(self):
        return f"{self.username} {self.email}"

