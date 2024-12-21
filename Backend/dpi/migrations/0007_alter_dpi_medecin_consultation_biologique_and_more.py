# Generated by Django 5.1.3 on 2024-12-21 00:46

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0006_alter_dpi_patient'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='dpi',
            name='medecin',
            field=models.ForeignKey(blank=True, limit_choices_to={'role': 'medecin'}, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assigned_dpis_medecin', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, null=True)),
                ('dpi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='consultations', to='dpi.dpi')),
            ],
        ),
        migrations.CreateModel(
            name='Biologique',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bilan_type', models.CharField(choices=[('biologique', 'Biologique'), ('radiologique', 'Radiologique')], default='biologique', max_length=20)),
                ('date', models.DateField(blank=True, null=True)),
                ('description', models.TextField()),
                ('tauxGlycemie', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('tauxPressionArterielle', models.CharField(blank=True, max_length=20, null=True)),
                ('tauxCholesterol', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('laborantin', models.ForeignKey(blank=True, limit_choices_to={'role': 'laborantin'}, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assigned_bilans_laborantin', to=settings.AUTH_USER_MODEL)),
                ('consultation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='biologique_bilans', to='dpi.consultation')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Radiologique',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bilan_type', models.CharField(choices=[('biologique', 'Biologique'), ('radiologique', 'Radiologique')], default='biologique', max_length=20)),
                ('date', models.DateField(blank=True, null=True)),
                ('consultation', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='radiologique_bilans', to='dpi.consultation')),
                ('radioloque', models.ForeignKey(blank=True, limit_choices_to={'role': 'radioloque'}, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='assigned_bilans_radioloque', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Examen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('images', models.ImageField(blank=True, null=True, upload_to='exams/')),
                ('bilan_radiologique', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='examens', to='dpi.radiologique')),
            ],
        ),
        migrations.CreateModel(
            name='Resume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('consultation', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='resume_consultation', to='dpi.consultation')),
            ],
        ),
        migrations.AddField(
            model_name='consultation',
            name='resume',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='consultation_resume', to='dpi.resume'),
        ),
    ]
