# Generated by Django 5.1.3 on 2024-12-28 12:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dpi', '0020_soin_diagnostic'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='soin',
            name='diagnostic',
        ),
        migrations.AddField(
            model_name='diagnostic',
            name='soin',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='soin_in', to='dpi.soin'),
        ),
    ]
