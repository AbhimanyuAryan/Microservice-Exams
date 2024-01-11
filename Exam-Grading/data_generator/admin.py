# data_generator/admin.py

from django.contrib import admin
from .models import FakeExam

admin.site.register(FakeExam)
