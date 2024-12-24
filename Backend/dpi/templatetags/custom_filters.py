from django import template

register = template.Library()

def format_dose(value):
    try:
        if value == int(value):
            return int(value)
        else:
            return value
    except (ValueError, TypeError):
        return value

register.filter('format_dose', format_dose)
