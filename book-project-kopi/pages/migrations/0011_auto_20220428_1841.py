# Generated by Django 3.1.14 on 2022-04-28 18:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0010_auto_20220428_1839'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emotion_data',
            name='age',
            field=models.CharField(default='0', max_length=10),
        ),
    ]