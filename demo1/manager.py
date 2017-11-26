# -.- coding:utf-8 -.-
# __author__ = 'cuizc'

from app import db
from config import DB_URI
from flask import Flask
from flask_script import Manager
from flask_migrate import MigrateCommand, Migrate
from app import models

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.init_app(app)

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

if __name__ == '__main__':
    manager.run()
