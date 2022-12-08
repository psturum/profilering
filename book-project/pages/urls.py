from django.urls import path

from .views import HomePageView, EmotionPageView, EmotionDataPageView, ProfilePageView, graph1PageView, graph2PageView

urlpatterns = [
    path('', HomePageView, name='home'),
    path('profile/', ProfilePageView, name='profile'),
    path('visualisering/humør-klokkeslæt', graph1PageView, name='graph1'),
    path('visualisering/oversigt', graph2PageView, name='graph2'),
    path('data/emotion', EmotionDataPageView, name='emotion_data'),
    path('programs/emotion/', EmotionPageView, name='emotion'),
]