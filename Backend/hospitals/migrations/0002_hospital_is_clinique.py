# Generated by Django 5.1.3 on 2024-12-09 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hospitals', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='hospital',
            name='is_clinique',
            field=models.BooleanField(default=False),
        ),
    ]