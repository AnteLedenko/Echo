from django.db import migrations
import os

def create_superuser(apps, schema_editor):
    User = apps.get_model('users', 'User')
    email = os.getenv('DJANGO_SUPERUSER_EMAIL')
    password = os.getenv('DJANGO_SUPERUSER_PASSWORD')
    first_name = os.getenv('DJANGO_SUPERUSER_FIRSTNAME')
    last_name = os.getenv('DJANGO_SUPERUSER_LASTNAME')

    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_user_managers_remove_user_username'),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
