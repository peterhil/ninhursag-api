from app.settings import project_name
try:
    from instance.settings import project_name
except ImportError:
    pass
