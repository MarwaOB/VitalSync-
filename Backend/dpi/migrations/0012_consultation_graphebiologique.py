# Generated by Django 5.1.3 on 2024-12-23 06:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0011_consultation_is_bilanbiologique_fait_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='consultation',
            name='grapheBiologique',
            field=models.ImageField(blank=True, upload_to='graphesBiologiques/'),
        ),
    ]
