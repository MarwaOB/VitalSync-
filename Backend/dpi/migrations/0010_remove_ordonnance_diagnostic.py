# Generated by Django 5.1.3 on 2024-12-21 15:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0009_remove_biologique_consultation_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='ordonnance',
            name='diagnostic',
        ),
    ]