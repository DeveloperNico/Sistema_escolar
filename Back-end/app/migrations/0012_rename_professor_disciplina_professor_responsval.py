# Generated by Django 5.2 on 2025-05-16 13:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_alter_usuario_ni'),
    ]

    operations = [
        migrations.RenameField(
            model_name='disciplina',
            old_name='professor',
            new_name='professor_responsval',
        ),
    ]
