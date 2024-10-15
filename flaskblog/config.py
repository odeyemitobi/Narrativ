import os

basedir = os.path.abspath(os.path.dirname(__file__))

profile_pics_path = os.path.join(basedir, 'static', 'profile_pics')


# Construct the SQLite database path
db_path = os.path.join(basedir, 'db.sqlite3')
class Config:
    SECRET_KEY = "JVFJUYFUYFUUH"
    SQLALCHEMY_DATABASE_URI = f'sqlite:///{db_path}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Mail config
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = "odeyemioluwatobiloba11@gmail.com"
    MAIL_PASSWORD = "ksoy chcc eyrd wter"
    UPLOAD_FOLDER = profile_pics_path
    
    
    
    
config = Config()
print("config.UPLOAD_FOLDER", config.UPLOAD_FOLDER)


