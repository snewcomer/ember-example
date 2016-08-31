from base import *
import os

# Disable debug
if os.environ.get('DEBUG'):
  DEBUG = True
else:
  DEBUG = False

# Must be explicitly specified when Debug is disabled
ALLOWED_HOSTS = [os.environ.get('ALLOWED_HOSTS', '*')]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ci',
        'USER': 'bsdev',
        'PASSWORD': 'tango',
        'HOST': os.environ.get('DATABASE_HOST', 'localhost'),
        'PORT': '5432',
    }
}

STATIC_ROOT = os.environ.get('STATIC_ROOT', '/var/www/backend/static')
MEDIA_ROOT = os.environ.get('MEDIA_ROOT', '/var/www/backend/media')
