from django.urls import path

from .views import HomePageView, DataPageView, ProgramPageView, EmotionPageView, PulsePageView, EmotionDataPageView, GazePageView, GazeDataPageView, ProfilePageView

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('profile/', ProfilePageView.as_view(), name='profile'),
    path('data/', DataPageView.as_view(), name='data'),
    path('data/emotion', EmotionDataPageView, name='emotion_data'),
    path('data/gaze', GazeDataPageView, name='gaze_data'),
    path('programs/', ProgramPageView.as_view(), name='programs'),
    path('programs/emotion/', EmotionPageView, name='emotion'),
    path('programs/pulse/', PulsePageView.as_view(), name='pulse'),
    path('programs/gaze/', GazePageView, name='gaze'),
]