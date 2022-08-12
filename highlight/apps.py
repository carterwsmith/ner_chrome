from django.apps import AppConfig
from transformers import LukeTokenizer, LukeForEntitySpanClassification


class HighlightConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'highlight'
