# Generated by Django 5.1.3 on 2024-12-14 00:41

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Dpi',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('QR_Code', models.ImageField(blank=True, upload_to='qr_codes')),
            ],
        ),
        migrations.CreateModel(
            name='Antecedent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titre', models.CharField(max_length=150)),
                ('description', models.TextField()),
                ('is_chirugical', models.BooleanField(default=False)),
                ('dpi', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='antecedents', to='dpi.dpi')),
            ],
        ),
    ]
