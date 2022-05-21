from django.shortcuts import render, get_object_or_404
from django.views.generic import TemplateView
from django.http import HttpResponseRedirect
from django.http import FileResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from pandas import json_normalize
from pathlib import Path  

from .models import Emotion_data, Gaze_data
from .forms import Emotion_data_Form, Gaze_data_Form
import random


# Create your views here.
#
class HomePageView(TemplateView):
    template_name = 'home.html'

@login_required
def ProfilePageView(request):
    if 'reset_data_id' in request.POST:
        request.user.alder = 0
        request.user.køn = "n/a"
        request.user.koncentrationsevne = "n/a"
        request.user.sidste_humør = "n/a"
        
        if(request.user.fag == "Informatik"):
            request.user.reklame = 1
        else:
            request.user.reklame = 2
        
        request.user.save()

        return HttpResponseRedirect(reverse("profile"))

    return render(request, "profile.html")

@login_required
def DataPageView(request):
    return render(request, "data.html")

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
def GazeDataPageView(request):
    gaze_data = Gaze_data.objects.filter(
        created_by=request.user).order_by('title')
    return render(request, "data_gaze.html", {'gaze_data': gaze_data})

@login_required
def ProgramPageView(request):
    return render(request, "programs.html")

@login_required
def GazePageView(request):
    context = {}
    
    # create object of form
    form = Gaze_data_Form(request.POST)
    # check if form data is valid
    print(form.is_valid())
    if form.is_valid():
        # save the form data to model
        new_Gaze_data = form.save(commit=True)
        new_Gaze_data.created_by = request.user
        new_Gaze_data.title = random.randint(0,1000000)

        # if(new_Gaze_data.up > new_Gaze_data.screen and new_Gaze_data.up > new_Gaze_data.down):
        #     request.user.koncentrationsevne = "høj"
        # elif (new_Gaze_data.screen > new_Gaze_data.up and new_Gaze_data.screen > new_Gaze_data.down):
        #     request.user.koncentrationsevne = "medium"
        # elif (new_Gaze_data.down > new_Gaze_data.up and new_Gaze_data.down > new_Gaze_data.screen):
        #     request.user.koncentrationsevne = "lav"
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

        if(new_Emotion_data.age == 17):
            request.user.reklame = 9
        elif(new_Emotion_data.dominant == "Sad"):
            request.user.reklame = 5
        elif(new_Emotion_data.dominant == "Happy"):
            request.user.reklame = 7
        elif(new_Emotion_data.dominant == "Angry"):
            request.user.reklame = 6

        request.user.save()
        new_Emotion_data.save()
        return HttpResponseRedirect(reverse("emotion_data"))

    context['data_form'] = form
    return render(request, "emotion.html", context)
    

