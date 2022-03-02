from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.urls import reverse
from django.contrib.auth import get_user_model, get_user
from .forms import Emotion_data_Form, Pulse_data_Form
from django.http import HttpResponseRedirect

# Create your views here.

class HomePageView(TemplateView):
    template_name = 'home.html'

class DataPageView(TemplateView):
    template_name = "data.html"

class EmotionDataPageView(TemplateView):
    template_name = "data_emotion.html"

class ProgramPageView(TemplateView):
    template_name = "programs.html"

class GazePageView(TemplateView):
    template_name = "gaze.html"

def PulsePageView(request):
    context ={}
    
    # create object of form
    form = Pulse_data_Form(request.POST)
    # check if form data is valid
    if form.is_valid():
        # save the form data to model
        new_pulse_data = form.save(commit=False)
        if(get_user_model().pulse_data != None):
            get_user_model().pulse_data = new_pulse_data
        else:
            get_user_model().emotion_data = new_pulse_data
            new_pulse_data.save()
        return HttpResponseRedirect(reverse("home"))
  
    context['data_form'] = form
    return render(request, "pulse.html", context)

def EmotionPageView(request):
    context ={}
    
    # create object of form
    form = Emotion_data_Form(request.POST)
    # check if form data is valid
    if form.is_valid():
        # save the form data to model
        new_Emotion_data = form.save(commit=False)
        if(get_user_model().emotion_data != None):
            get_user_model().emotion_data = new_Emotion_data
        else:
            get_user_model().emotion_data = new_Emotion_data
            new_Emotion_data.save()
        return HttpResponseRedirect(reverse("emotion_data"))
  
    context['data_form'] = form
    return render(request, "emotion.html", context)
    