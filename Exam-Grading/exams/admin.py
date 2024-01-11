from django.contrib import admin
from .models import Exam, Version, Question, Option, Answer, Student

admin.site.register(Exam)
admin.site.register(Version)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Answer)
admin.site.register(Student)
