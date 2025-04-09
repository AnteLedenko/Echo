from django.db import migrations
from django.utils.text import slugify

def create_categories(apps, schema_editor):
    Category = apps.get_model('categories', 'Category')
    categories = [
        {"name": "String Instruments", "icon": "category_icons/string-instruments.png", "order": 1},
        {"name": "Percussion", "icon": "category_icons/percussion.png", "order": 4},
        {"name": "Wind Instruments", "icon": "category_icons/wind-instruments.png", "order": 3},
        {"name": "Key Instruments", "icon": "category_icons/key-instruments.png", "order": 2},
        {"name": "Speakers and Studio Equipment", "icon": "category_icons/speakers-and-studio-equipment.png", "order": 5},
        {"name": "Other", "icon": "category_icons/other.png", "order": 6},
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
        ('categories', '0003_alter_category_options_category_order'),
    ]

    operations = [
        migrations.RunPython(create_categories),
    ]
