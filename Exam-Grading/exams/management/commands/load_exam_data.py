import json
import requests
from django.core.management.base import BaseCommand
from exams import Exam, Version, Question, Option, Answer, Student

class Command(BaseCommand):
    help = 'Load exam data from http://localhost:5001/exam and store it in the model'

    def handle(self, *args, **kwargs):
        # URL to fetch data from
        url = 'http://localhost:5001/exam'

        try:
            # Make a GET request to the URL
            response = requests.get(url)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Parse JSON data from the response
                json_data = response.json()

                # Assuming the JSON data structure matches the model fields
                exam_data = json_data.get('exam', {})
                version_data = json_data.get('version', {})
                question_data = json_data.get('question', {})
                option_data = json_data.get('option', {})
                answer_data = json_data.get('answer', {})
                student_data = json_data.get('student', {})

                # Create Exam object
                exam = Exam.objects.create(
                    name=exam_data.get('name'),
                    duration=exam_data.get('duration'),
                    backspace_allowed=exam_data.get('backspace_allowed'),
                    active=exam_data.get('active')
                )

                # Create Version object
                version = Version.objects.create(
                    exam=exam,
                    version_number=version_data.get('version_number')
                )

                # Create Student object
                student = Student.objects.create(
                    student_id=student_data.get('student_id')
                )

                # Add student to the Version's students ManyToManyField
                version.students.add(student)

                # Create Question object
                question = Question.objects.create(
                    version=version,
                    description=question_data.get('description'),
                    value=question_data.get('value')
                )

                # Create Option object
                option = Option.objects.create(
                    question=question,
                    description=option_data.get('description'),
                    correct=option_data.get('correct')
                )

                # Create Answer object
                answer = Answer.objects.create(
                    option=option,
                    teacher_feedback=answer_data.get('teacher_feedback'),
                    grade=answer_data.get('grade')
                )

                self.stdout.write(self.style.SUCCESS('Data loaded successfully'))
            else:
                self.stdout.write(self.style.ERROR(f'Failed to fetch data. Status code: {response.status_code}'))

        except requests.RequestException as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
