from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import get_user_model, get_user
from django.contrib.auth.decorators import login_required

from .models import Emotion_data, Gaze_data
from .forms import Emotion_data_Form, Gaze_data_Form
import random


# Create your views here.

class HomePageView(TemplateView):
    template_name = 'home.html'

@login_required
def ProfilePageView(request):
    return render(request, "profile.html")

@login_required
def DataPageView(request):
    return render(request, "data.html")

@login_required
def EmotionDataPageView(request):
    if request.method == "POST":
        delete_data_id = request.POST['delete_data_id']
        data = get_object_or_404(Emotion_data, id=delete_data_id)
        data.delete()
        return HttpResponseRedirect(reverse("emotion_data"))

    emotion_data = Emotion_data.objects.filter(
        created_by=request.user).order_by('-created_at')
    return render(request, "data_emotion.html", {'emotion_data': emotion_data})

@login_required
def GazeDataPageView(request):
    gaze_data = Gaze_data.objects.filter(
        created_by=request.user).order_by('title')
    return render(request, "data_gaze.html", {'gaze_data': gaze_data})

@login_required
def ProgramPageView(request):
    return render(request, "programs.html")

@login_required
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

@login_required
def EmotionPageView(request):
    context ={}
    # create object of form
    form = Emotion_data_Form(request.POST)

    if form.is_valid():
        # save the form data to model
        new_Emotion_data = form.save(commit=True)
        new_Emotion_data.created_by = request.user
        new_Emotion_data.title = random.randint(0,1000000)

        list_vals = [new_Emotion_data.angry, new_Emotion_data.disgusted, new_Emotion_data.fearful, new_Emotion_data.happy,
        new_Emotion_data.sad, new_Emotion_data.surprised]
        emotions = ['Angry', 'Disgusted', 'Fearful', 'Happy', 'Sad', 'Surprised']
        max_value = max(list_vals)
        max_index = list_vals.index(max_value)
        new_Emotion_data.dominant = emotions[max_index]
        request.user.sidste_humør = emotions[max_index]
        request.user.alder = new_Emotion_data.age
        request.user.køn = new_Emotion_data.gender
        request.user.save()
        new_Emotion_data.save()

    context['data_form'] = form
    return render(request, "emotion.html", context)
    