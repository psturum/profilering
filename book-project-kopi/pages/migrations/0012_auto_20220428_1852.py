# Generated by Django 3.1.14 on 2022-04-28 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0011_auto_20220428_1841'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emotion_data',
            name='age',
            field=models.IntegerField(default=0),
        ),
    ]