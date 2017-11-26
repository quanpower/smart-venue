from app import app
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import db

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)

# app.run(host='0.0.0.0', port=8080, debug=True)
manager.run()
