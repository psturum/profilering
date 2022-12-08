from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.http import FileResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from pandas import json_normalize
from pathlib import Path  
import pandas as pd
import math

from .models import Emotion_data
from .forms import Emotion_data_Form
import random


# Create your views here.
#
@login_required
def HomePageView(request):
    emotion_data = Emotion_data.objects.filter(
        created_by=request.user)
    context = {}
    if(len(emotion_data) > 0):
        latest = emotion_data[0]
        latest_mood = latest.dominant

    return render(request, "home.html", context)
    



@login_required
def ProfilePageView(request):
    emotion_data = Emotion_data.objects.filter(
        created_by=request.user).order_by('-created_at')
    if(len(emotion_data) > 0):
        request.user.sidste_humør = emotion_data[0].dominant
    else:
        request.user.sidste_humør = "n/a"
        
    if 'reset_data_id' in request.POST:
        request.user.alder = 0
        request.user.køn = "n/a"
        request.user.sidste_humør = "n/a"
        
        if(request.user.fag == "Informatik"):
            request.user.reklame = 1
        else:
            request.user.reklame = 2
        
        request.user.save()

        return HttpResponseRedirect(reverse("profile"))

    return render(request, "profile.html")

@login_required
def graph1PageView(request):
    context ={}
    y_happy = []
    y_sad = []
    y_angry = []
    y_disgusted = []
    y_neutral = []
    y_surprised = []
    y_fearful = []
    x_time = []
    emotion_data = Emotion_data.objects.filter(
        created_by=request.user).order_by('created_at__hour', 'created_at__minute')
    
    for data in emotion_data:
        y_happy += [float(data.happy/data.faces)]
        y_angry += [float(data.angry/data.faces)]
        y_surprised += [float(data.surprised/data.faces)]
        y_disgusted += [float(data.disgusted/data.faces)]
        y_neutral += [float(data.neutral/data.faces)]
        y_fearful += [float(data.fearful/data.faces)]
        y_sad += [float(data.sad/data.faces)]
        if(float(data.created_at.time().hour) == 23):
            x_time.append([0, float(data.created_at.time().minute), float(data.created_at.time().second)])
        else:
            x_time.append([1+float(data.created_at.time().hour), float(data.created_at.time().minute), float(data.created_at.time().second)])

    context['x'] = x_time
    context['happy'] = y_happy
    context['angry'] = y_angry
    context['neutral'] = y_neutral
    context['disgusted'] = y_disgusted
    context['sad'] = y_sad
    context['surprised'] = y_surprised
    context['fearful'] = y_fearful
    return render(request, "graph_1.html", context)

@login_required
def graph2PageView(request):
    context ={}
    y_happy = 0
    y_sad = 0
    y_angry = 0
    y_disgusted = 0
    y_neutral = 0
    y_surprised = 0
    y_fearful = 0
    face = 0
    emotion_data = Emotion_data.objects.filter(
        created_by=request.user)

    for data in emotion_data:
        y_happy += float(data.happy)
        y_angry += float(data.angry)
        y_surprised += float(data.surprised)
        y_disgusted += float(data.disgusted)
        y_neutral += float(data.neutral)
        y_fearful += float(data.fearful)
        y_sad += float(data.sad)
        face += data.faces

    if(face > 0):
        context['happy'] = str(y_happy/face)
        context['angry'] = str(y_angry/face)
        context['neutral'] = str(y_neutral/face)
        context['disgusted'] = str(y_disgusted/face)
        context['sad'] = str(y_sad/face)
        context['surprised'] = str(y_surprised/face)
        context['fearful'] = str(y_fearful/face)
    return render(request, "graph_2.html", context)

@login_required
def EmotionDataPageView(request):
    if 'delete_data_id' in request.POST:
        delete_data_id = request.POST['delete_data_id']
        data = get_object_or_404(Emotion_data, id=delete_data_id)
        data.delete()
        return HttpResponseRedirect(reverse("emotion_data"))
    
    if 'download_data_id' in request.POST:
        download_data_id = request.POST['download_data_id']
        data = get_object_or_404(Emotion_data, id=download_data_id)
        json_data = data.data
        df = json_normalize(json_data) 

        # """ SAVE CSV-FILE TO /static """
        filepath = Path('static/data/csv/emotion_data' + str(data.title) + '.csv')   
        df.to_csv(filepath) 

        response = FileResponse(open(filepath, 'rb'))
        return response

    emotion_data = Emotion_data.objects.filter(
        created_by=request.user).order_by('-created_at')
    return render(request, "data_emotion.html", {'emotion_data': emotion_data})

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

        if(float(list_vals[max_index]) > float(new_Emotion_data.neutral) * 0.4):
            new_Emotion_data.dominant = emotions[max_index]
        else:
            new_Emotion_data.dominant = "Neutral"

        request.user.sidste_humør = new_Emotion_data.dominant
        request.user.alder = new_Emotion_data.age
        request.user.køn = new_Emotion_data.gender

        if(new_Emotion_data.age == 17):
            request.user.reklame = 9
        elif(new_Emotion_data.dominant == "Sad"):
            request.user.reklame = 5
        elif(new_Emotion_data.dominant == "Angry"):
            request.user.reklame = 6
        elif(new_Emotion_data.dominant == "Happy"):
            request.user.reklame = 7
        elif(new_Emotion_data.gender == "Female"):
            request.user.reklame = 4
        elif(new_Emotion_data.gender == "Male"):
            request.user.reklame = 3

        request.user.save()
        new_Emotion_data.save()
        return HttpResponseRedirect(reverse("emotion_data"))

    context['data_form'] = form
    return render(request, "emotion.html", context)
    

