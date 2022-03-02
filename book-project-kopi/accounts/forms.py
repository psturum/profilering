from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from allauth.account.forms import SignupForm
from .models import CustomUser

class MyUserCreationForm(UserCreationForm):
    skole = forms.CharField(required=True)
    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('username', 'skole','password1','password2')

class MyUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm):
        model = CustomUser
        fields = ('username', 'skole',)

class SimpleSignupForm(SignupForm):
    skole = forms.CharField(max_length=20)
    def save(self, request):
        user = super(SimpleSignupForm, self).save(request)
        user.skole = self.cleaned_data['skole']
        user.save()
        return user