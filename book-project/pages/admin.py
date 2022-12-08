from django.contrib import admin
from .models import Emotion_data

# Register your models here.

class Emotion_data_Admin(admin.ModelAdmin):
    list_display = ("title", "created_by", "created_at" , "faces", "angry", "disgusted", "fearful", "happy", "neutral", "sad", "surprised", "dominant",)


admin.site.register(Emotion_data, Emotion_data_Admin)