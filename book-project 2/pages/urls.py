from django.urls import path

from .views import HomePageView, DataPageView, ProgramPageView, EmotionPageView, EmotionDataPageView, GazePageView, GazeDataPageView, ProfilePageView

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('profile/', ProfilePageView, name='profile'),
    path('data/', DataPageView, name='data'),
    path('data/emotion', EmotionDataPageView, name='emotion_data'),
    path('data/gaze', GazeDataPageView, name='gaze_data'),
    path('programs/', ProgramPageView, name='programs'),
    path('programs/emotion/', EmotionPageView, name='emotion'),
    path('programs/gaze/', GazePageView, name='gaze'),
]