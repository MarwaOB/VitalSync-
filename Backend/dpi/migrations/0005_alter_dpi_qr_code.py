# Generated by Django 5.1.3 on 2024-12-20 16:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0004_dpi_medecin_dpi_patient'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dpi',
            name='QR_Code',
            field=models.ImageField(blank=True, upload_to='qr_codes/'),
        ),
    ]
