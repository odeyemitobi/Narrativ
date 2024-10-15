from flask import Blueprint, request, render_template, jsonify
from flask_login import current_user
from sqlalchemy import desc
from flaskblog.models import Post, db, User

main = Blueprint('main', __name__)

@main.route("/", methods=['GET'])
@main.route("/home", strict_slashes=False, methods=['GET'])
def index_page():    
    print('tp',dir(current_user))
    user_data = None
    if (current_user.is_authenticated):
        user_data = {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'is_active': current_user.is_active,
            'is_authenticated': current_user.is_authenticated
        }
    else:
        user_data = {
            'is_active': current_user.is_active,
            'is_authenticated': current_user.is_authenticated

        }
    return render_template("home.html", user_data=user_data)



@main.route("/about", strict_slashes=False)
def about_page():
    return render_template("about.html")
