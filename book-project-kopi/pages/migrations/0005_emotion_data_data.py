# Generated by Django 3.1.14 on 2022-04-04 20:40

from django.db import migrations
import picklefield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0004_gaze_data_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='emotion_data',
            name='data',
            field=picklefield.fields.PickledObjectField(default=0, editable=False),
            preserve_default=False,
        ),
    ]