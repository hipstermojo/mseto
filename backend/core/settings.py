import os

DATABASE_URL = os.environ.get(
    'DATABASE_URL') or 'postgres://postgres:1234@localhost:5432/mseto_dev'

TORTOISE_ORM = {
    "connections": {"default": DATABASE_URL},
    "apps": {
        "models": {
            "models": ["core.models", "aerich.models"],
            "default_connection": "default",
        },
    },
}
