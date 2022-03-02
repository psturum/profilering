from django.urls import path

from .views import HomePageView, DataPageView, ProgramPageView, EmotionPageView, PulsePageView, EmotionDataPageView, GazePageView

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('data/', DataPageView.as_view(), name='data'),
    path('data/emotion', EmotionDataPageView.as_view(), name='emotion_data'),
    path('programs/', ProgramPageView.as_view(), name='programs'),
    path('programs/emotion/', EmotionPageView, name='emotion'),
    path('programs/pulse/', PulsePageView, name='pulse'),
    path('programs/gaze/', GazePageView.as_view(), name='gaze'),
]