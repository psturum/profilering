# Generated by Django 3.1.14 on 2022-02-23 00:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0001_initial'),
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='skole1',
        ),
        migrations.AddField(
            model_name='customuser',
            name='emotion_data',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pages.emotion_data'),
        ),
    ]