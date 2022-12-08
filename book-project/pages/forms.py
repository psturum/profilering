# import form class from django
from django import forms
from .models import Emotion_data
  
# create a ModelForm
class Emotion_data_Form(forms.ModelForm):
    # specify the name of model to use
    class Meta:
        model = Emotion_data
        fields = "__all__"
        exclude = ('title', 'created_by', 'created_at', 'dominant',)


