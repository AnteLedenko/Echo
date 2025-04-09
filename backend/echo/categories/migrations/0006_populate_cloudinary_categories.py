from django.db import migrations
from django.utils.text import slugify

def populate_categories(apps, schema_editor):
    Category = apps.get_model('categories', 'Category')
    categories = [
        {"name": "String Instruments", "icon": "string-instruments_kyygjw", "order": 1},
        {"name": "Key Instruments", "icon": "key-instruments_r8tf6b", "order": 2},
        {"name": "Wind Instruments", "icon": "wind-instruments_ymljd9", "order": 3},
        {"name": "Percussion", "icon": "percussion_ysdixz", "order": 4},
        {"name": "Speakers and Studio Equipment", "icon": "speakers-and-studio-_equipment_dz8mp0", "order": 5},
        {"name": "Other", "icon": "other_uokmuf", "order": 6},
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

