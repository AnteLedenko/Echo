from django.db import migrations
from django.utils.text import slugify

def populate_categories(apps, schema_editor):
    Category = apps.get_model('categories', 'Category')
    categories = [
        {"name": "String Instruments", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/string-instruments.png", "order": 1},
        {"name": "Percussion", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/percussion.png", "order": 4},
        {"name": "Wind Instruments", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/wind-instruments.png", "order": 3},
        {"name": "Key Instruments", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/key-instruments.png", "order": 2},
        {"name": "Speakers and Studio Equipment", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/speakers-and-studio-equipment.png", "order": 5},
        {"name": "Other", "icon": "https://res.cloudinary.com/dpabrqxuy/image/upload/v1234567890/echo_project/category-icons/other.png", "order": 6},
    ]

    for cat in categories:
        slug = slugify(cat["name"])
        Category.objects.update_or_create(
            slug=slug,
            defaults={
                "name": cat["name"],
                "icon": cat["icon"],
                "order": cat["order"],
            }
        )

class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0005_alter_category_icon'),
    ]

    operations = [
        migrations.RunPython(populate_categories),
    ]
