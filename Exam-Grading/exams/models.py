from django.db import models

class Exam(models.Model):
    name = models.CharField(max_length=255)
    duration = models.IntegerField()
    backspace_allowed = models.BooleanField()
    active = models.BooleanField()

    def __str__(self):
        return self.name

class Version(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    version_number = models.IntegerField()
    students = models.ManyToManyField('Student', related_name='versions')

    def __str__(self):
        return f"Version {self.version_number} of {self.exam.name}"

class Question(models.Model):
    version = models.ForeignKey(Version, on_delete=models.CASCADE)
    description = models.TextField()
    value = models.IntegerField()
    # Assuming multiple options for a question
    options = models.ManyToManyField('Option', related_name='questions')

    def __str__(self):
        return self.description

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    description = models.TextField()
    correct = models.BooleanField()

    def __str__(self):
        return self.description

class Answer(models.Model):
    option = models.ForeignKey('Option', on_delete=models.CASCADE)
    teacher_feedback = models.TextField(blank=True, null=True)
    grade = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"Answer for Question: {self.option.question.description}, Option: {self.option.description}"

class Student(models.Model):
    student_id = models.IntegerField(unique=True)

    def __str__(self):
        return self.name
