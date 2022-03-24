from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.urls import reverse
from django.contrib.auth import get_user_model, get_user

from pages.models import Emotion_data, Gaze_data
from .forms import Emotion_data_Form, Gaze_data_Form
from django.http import HttpResponseRedirect
import random

# Create your views here.

class HomePageView(TemplateView):
    template_name = 'home.html'

class ProfilePageView(TemplateView):
    template_name = "profile.html"

class DataPageView(TemplateView):
    template_name = "data.html"

def EmotionDataPageView(request):
    emotion_data = Emotion_data.objects.filter(
        created_by=request.user).order_by('title')
    return render(request, "data_emotion.html", {'emotion_data': emotion_data})

def GazeDataPageView(request):
    gaze_data = Gaze_data.objects.filter(
        created_by=request.user).order_by('title')
    return render(request, "data_gaze.html", {'gaze_data': gaze_data})

class ProgramPageView(TemplateView):
    template_name = "programs.html"

class PulsePageView(TemplateView):
    template_name = "emotion.html"

def GazePageView(request):
    context ={}
    
    # create object of form
    form = Gaze_data_Form(request.POST)
    # check if form data is valid
    if form.is_valid():
        # save the form data to model
        new_Gaze_data = form.save(commit=True)
        new_Gaze_data.created_by = request.user
        new_Gaze_data.title = random.randint(0,1000000)

        new_Gaze_data.save()
        # return HttpResponseRedirect(reverse("gaze_data"))
    
    context['data_form'] = form
    return render(request, "gaze.html", context)

def EmotionPageView(request):
    context ={}
    
    # create object of form
    form = Emotion_data_Form(request.POST)
    # form.title = get_user_model().username
    # check if form data is valid
    if form.is_valid():
        # save the form data to model
        new_Emotion_data = form.save(commit=True)
        new_Emotion_data.created_by = request.user
        new_Emotion_data.title = random.randint(0,1000000)

        list_vals = [new_Emotion_data.angry, new_Emotion_data.disgusted, new_Emotion_data.fearful, new_Emotion_data.happy,
        new_Emotion_data.sad, new_Emotion_data.surprised]
        emotions = ['angry', 'disgusted', 'fearful', 'happy', 'sad', 'surprised']
        max_value = max(list_vals)
        max_index = list_vals.index(max_value)
        new_Emotion_data.dominant = emotions[max_index]
        new_Emotion_data.save()
        # return HttpResponseRedirect(reverse("emotion_data"))
    
    context['data_form'] = form
    return render(request, "emotion.html", context)
    