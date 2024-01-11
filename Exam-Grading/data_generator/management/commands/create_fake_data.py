from django.core.management.base import BaseCommand
from faker import Faker
from exams.models import Exam, Version, Question, Option, Answer, Student

fake = Faker()

class Command(BaseCommand):
    help = 'Generate fake data for frontend testing'

    def handle(self, *args, **kwargs):
        # Create fake exams
        for _ in range(10):
            fake_exam = Exam.objects.create(
                name=fake.word(),
                duration=fake.random_int(min=60, max=180),
                backspace_allowed=fake.boolean(),
                active=True
            )

            # Create fake version
            version = Version.objects.create(exam=fake_exam, version_number=fake.random_int(min=1, max=10))

            # Create fake question
            question = Question.objects.create(
                version=version,
                description=fake.sentence(),
                value=fake.random_int(min=1, max=100)
            )

            # Create fake options
            option1 = Option.objects.create(question=question, description=fake.word(), correct=True)
            option2 = Option.objects.create(question=question, description=fake.word(), correct=False)

            # Create fake answer
            Answer.objects.create(option=option1)  # Associate with the correct option

        self.stdout.write(self.style.SUCCESS('Fake data created successfully!'))
