from flaskblog import create_app
app = create_app()

# create databse tables
from flaskblog import db
with app.app_context():
    db.create_all()
    print("Database tables created!")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    # app.run(debug=True)
