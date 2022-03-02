from django.contrib import admin
from .models import Emotion_data

# Register your models here.

class Emotion_data_Admin(admin.ModelAdmin):
    list_display = ("title", "faces", "angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised")

admin.site.register(Emotion_data, Emotion_data_Admin)