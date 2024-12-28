# Generated by Django 5.1.3 on 2024-12-21 13:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0008_alter_consultation_resume_diagnostic_ordonnance_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='biologique',
            name='consultation',
        ),
        migrations.RemoveField(
            model_name='diagnostic',
            name='consultation',
        ),
        migrations.RemoveField(
            model_name='radiologique',
            name='consultation',
        ),
        migrations.AddField(
            model_name='consultation',
            name='bilanBiologique',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bilanBiologique', to='dpi.biologique'),
        ),
        migrations.AddField(
            model_name='consultation',
            name='bilanRadiologique',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bilanRadiologique', to='dpi.radiologique'),
        ),
        migrations.AddField(
            model_name='consultation',
            name='diagnostic',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='consultation', to='dpi.diagnostic'),
        ),
    ]
