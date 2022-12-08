from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .forms import MyUserCreationForm, MyUserChangeForm

CustomUser = get_user_model()

class CustomUserAdmin(UserAdmin):
    add_form = MyUserCreationForm
    form = MyUserChangeForm
    model = CustomUser
    list_display = ['username', 'skole', 'fag', 'alder', 'køn', 'sidste_humør', 'avg_humør', 'it_færdighed', 'reklame']
    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('skole', 'fag', 'reklame')}),
    ) #this will allow to change these fields in admin module


admin.site.register(CustomUser, CustomUserAdmin)
