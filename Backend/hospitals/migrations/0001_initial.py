# Generated by Django 5.1.3 on 2024-12-21 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hospital',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(default='', max_length=50)),
                ('lieu', models.TextField(default='')),
                ('dateCreation', models.DateField(default='2024-01-01')),
                ('nombrePatients', models.IntegerField(default=0)),
                ('nombrePersonnels', models.IntegerField(default=0)),
                ('is_clinique', models.BooleanField(default=False)),
            ],
        ),
    ]