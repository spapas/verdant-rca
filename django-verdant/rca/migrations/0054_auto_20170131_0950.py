# -*- coding: utf-8 -*-
# Generated by Django 1.9.9 on 2017-01-31 09:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rca', '0053_researchitem_featured'),
    ]

    operations = [
        migrations.AlterField(
            model_name='researchitem',
            name='featured',
            field=models.BooleanField(default=False, help_text=b''),
        ),
    ]
