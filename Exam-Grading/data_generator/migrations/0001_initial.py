# Generated by Django 4.0 on 2024-01-01 17:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FakeExam',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('duration', models.IntegerField()),
                ('backspace_allowed', models.BooleanField()),
                ('active', models.BooleanField()),
            ],
        ),
    ]
