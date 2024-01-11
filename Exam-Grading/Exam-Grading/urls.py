from django.contrib import admin
from django.urls import path, include
from exams.views import (
    ExamListCreateView, ExamRetrieveUpdateDestroyView,
    VersionListCreateView, VersionRetrieveUpdateDestroyView,
    QuestionListCreateView, QuestionRetrieveUpdateDestroyView,
    OptionListCreateView, OptionRetrieveUpdateDestroyView,
    AnswerListCreateView, AnswerRetrieveUpdateDestroyView,
    StudentListCreateView, StudentRetrieveUpdateDestroyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('exams/', ExamListCreateView.as_view(), name='exam-list-create'),
    path('exams/<int:pk>/', ExamRetrieveUpdateDestroyView.as_view(), name='exam-retrieve-update-destroy'),
    path('versions/', VersionListCreateView.as_view(), name='version-list-create'),
    path('versions/<int:pk>/', VersionRetrieveUpdateDestroyView.as_view(), name='version-retrieve-update-destroy'),
    path('questions/', QuestionListCreateView.as_view(), name='question-list-create'),
    path('questions/<int:pk>/', QuestionRetrieveUpdateDestroyView.as_view(), name='question-retrieve-update-destroy'),
    path('options/', OptionListCreateView.as_view(), name='option-list-create'),
    path('options/<int:pk>/', OptionRetrieveUpdateDestroyView.as_view(), name='option-retrieve-update-destroy'),
    path('answers/', AnswerListCreateView.as_view(), name='answer-list-create'),
    path('answers/<int:pk>/', AnswerRetrieveUpdateDestroyView.as_view(), name='answer-retrieve-update-destroy'),
    path('students/', StudentListCreateView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentRetrieveUpdateDestroyView.as_view(), name='student-retrieve-update-destroy'),
]
