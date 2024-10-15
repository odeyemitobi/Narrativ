from flask import Blueprint, redirect, flash, url_for, render_template, session, request, current_app, jsonify
from flask_login import current_user, logout_user, login_user, login_required
from werkzeug.utils import secure_filename
from uuid import uuid4
import os
from flaskblog.users.forms import (
    Register_Form,
    Login_Form,
    Update_Account_Form,
    Reset_Request_Form,
    Reset_Password,
)
from flaskblog.users.utils import send_email
from flaskblog.models import User
from flaskblog import bcrypt, db


users = Blueprint("users", __name__)


# User Registration route
@users.route("/register", strict_slashes=False, methods=["GET", "POST"])
def register_page():
    if current_user.is_authenticated:
        return redirect("index_page")
    
    #  check if request is Post
    if request.method == "POST":
        print(f"Content-Type: {request.content_type}")

        print(f"Content-Type: {request.content_type}")
        print(f"Request Data: {request.data}")

        if request.content_type != 'application/json':
            print(f"Content-Type: {request.content_type}")
            return jsonify({'error': 'Unsupported Media Type'}), 415
        # convert to dictionary
        data = request.get_json()

        # extract credentials
        username = data.get('username')
        email = data.get('email')

        # validate user credentials does not exists before attempting to persist to db.

        # declare an empty dictionary for error handling
        errors = {}


        if User.query.filter_by(username=username).first() and User.query.filter_by(email=email).first():
            errors['username_and_email_taken'] = 'Username already exists and Email already registered, Please choose a different ones'
        elif User.query.filter_by(username=username).first():
            errors['username_taken'] = 'Username already exists. Please choose a different one.'

        elif User.query.filter_by(email=email).first():
            errors['email_taken'] = 'Email already registered. Please use a different email address.'


        if errors:
            print(errors)
            return jsonify({'errors': errors})
        
        # save user in the database.
        user = User(
            username= data.get('username'),
            email= data.get('email'),
            password=bcrypt.generate_password_hash(data.get('password')).decode("utf-8"),
        )
        db.session.add(user)
        db.session.commit()
        db.session.close()

        return jsonify({"welcome_message": 'Thank you for Joining us', 'redirect_url': url_for('users.login_page'), 'username': data.get('username')})
    else:
        return render_template("register.html")


# User Login Route
@users.route("/login", strict_slashes=False, methods=["GET", "POST"])
def login_page():
    print('login paguihiuhe')
    if current_user.is_authenticated:
        return redirect(url_for("main.index_page"))
    """
    Get users email from form email field
    Check if  email exists in database
    if email exists:
        User has account in our database
        Unhash the password of the user
        Compare the the unhashed password with the form password.
        if Match:
            Login the User in, add remember me field.
    """
    # form = Login_Form()
    if request.method == 'POST':
        data = request.get_json()

        email = data.get('email')
        password = data.get('password')

        print('user email', email)
        print('user password', password)
        user = db.session.query(User).filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):

            # log the user in using session object from flask
            login_user(user)

            return jsonify({'status':'success','login_message': f"Success! You're logged in and ready to go, {user.username}", 'redirect_url': url_for('main.index_page')}), 200
                            

        else:
            return jsonify({"status": 'failure', 'login_message': 'Invalid username or password'}), 400


    return render_template("login.html")


@users.route("/account", methods=["GET", "POST"])
@login_required
def account_page():
    form = Update_Account_Form()

    if form.validate_on_submit():
        current_user.username = form.username.data
        current_user.email = form.email.data

        # update profile pic.
        if form.profile_pic.data:
            profile_pic_filname = secure_filename(form.profile_pic.data.filename)

            _, file_ext = os.path.splitext(profile_pic_filname)

            random_filename = f"{uuid4()}{file_ext}"

            profile_pic_ = os.path.join(current_app.config["UPLOAD_FOLDER"], random_filename)
            form.profile_pic.data.save(profile_pic_)
            current_user.image_file = random_filename
        try:
            db.session.commit()
            flash('Your account was successfully Updated', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f"An error occured {e}")
    elif request.method == "GET":
        form.username.data = current_user.username
        form.email.data = current_user.email
    img_file = url_for("static", filename="profile_pics/" + "default.jpg")
    return render_template("account.html", form=form, img_file=img_file)


# logout route
@users.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main.index_page"))


# Send TOTP for reseting email.
@users.route("/reset-password", methods=["GET", "POST"])
def send_email_link():
    form = Reset_Request_Form()
    if request.method == "POST":
            print('useremail', request.get_json().get('email'))
            user = db.session.query(User).filter_by(email=request.get_json().get('email')).first()
            print(user)
            if user:

                # call the send maiil function
                send_email(user)

                flash(
                    "Email sent successfully!, follow link to reset your password",
                    category="success",
                )
               
                return jsonify({'status': 'success', 'message':"Email sent successfully!, follow link to reset your password"}), 200
            else:
                return jsonify({'status': 'failure', 'message':"Email does not exist in our system"}), 400

    return render_template("reset_email.html")


# Password Reset
@users.route("/reset-password/<string:token>", methods=["GET", "POST"])
def reset_password(token):
    user = User.validate_token(token, expire_sec=300)

    print('inside the reset password link')

    if request.method == "POST":
        print('inside post reset password, naa me dee for here')
        # user variable would be None if the time set on the link expires.
        if user is None:
            return jsonify(
                {
                    'status': 'error',
                    'message': 'The reset link is either invalid or has expired. Please request a new password reset.',
                    'redirect_url': url_for("users.send_email_link")
                }
            ), 400

        #  hash user password
        user.password = bcrypt.generate_password_hash(request.get_json().get('password')).decode(
            "utf-8"
        )

        # # update user password.
        db.session.commit()
        return jsonify(
            {
                'status': 'success',
                'message': 'Your password has been successfully reset. You can now log in with your new password. redirecting....',
                'redirect_url': url_for("users.login_page")
            }
        ), 200

    # render reset password template on GET REQUEST.
    return render_template("reset_password.html")
