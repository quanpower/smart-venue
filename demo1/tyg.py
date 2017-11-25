# -.- coding:utf-8 -.-
# __author__ = 'cuizc'

from flask import Flask
from flask_restful import Api, Resource, abort, reqparse
from flasgger import Swagger, swag_from
from app import db
from app import models
from config import DB_URI

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db.init_app(app)

# api = Api(app)
# swagger = Swagger(app)

# app.config['SWAGGER'] = {
#     'title': 'SmartLinkCloud RESTful API',
#     'uiversion': 2
# }

# parser = reqparse.RequestParser()
# parser.add_argument('task')


@app.route('/')
def hello_world():
    print "dd"
    instance = models.User.query.filter_by(user_name="aa").first()
    return "hello world " + str(instance.age)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8888, debug=True)

