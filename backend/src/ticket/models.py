from __future__ import unicode_literals

from django.db import models

class Ticket(models.Model):
    request = models.CharField(max_length=256, null=True, blank=True)
