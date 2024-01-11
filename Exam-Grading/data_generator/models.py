# data_generator/models.py

from django.db import models

class FakeExam(models.Model):
    name = models.CharField(max_length=255)
    duration = models.IntegerField()
    backspace_allowed = models.BooleanField()
    active = models.BooleanField()

    def __str__(self):
        return self.name
