from flask import Blueprint, redirect, render_template, url_for, abort, flash, request, jsonify
from flaskblog.posts.forms import NEW_POST, EDIT_POST
from flaskblog.models import Post, db
from flask_login import current_user, login_required
from sqlalchemy import desc

posts = Blueprint("posts", __name__)


@posts.route("/create-post", methods=["GET", "POST"])
@login_required
def create_post():
    print('just arived in the create-post')

    if request.method == 'POST':

        print('i am here in the post method')
        category = request.args.get('category')
        print('this is the request args',request.args)
        print('this is the category', category)
        print('inside the post, where is the category', category)
        post_title = request.get_json().get('postTitle').strip()
        post_content = request.get_json().get('postContent').strip()
        post_category = request.args.get('category').strip()
        user_post = Post(
            title=post_title,
            content=post_content,
            user_id=current_user.id,
            category = post_category.capitalize(),
            author=current_user
        )

        db.session.add(user_post)
        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Post was successfully created!', 'redirect_url': url_for('main.index_page')}), 200

    return render_template("post.html")



# filter posts
@posts.route("/filter_posts", strict_slashes=False, methods=['GET'])
def filter_posts():
    if 'category' in request.args:
        category = request.args.get('category').strip()
        print('this is category', len(category))

        posts = Post.query.filter_by(category=category).all()
        if (posts):

            print('all post', posts)
            posts_array = []
            for post in posts:
                print('post_title', post.title)
                post_data = {
                    'title': post.title,
                    'content': post.content,
                    'created_at':post.date_posted.strftime('%d%b %Y').capitalize(),
                    'author': post.author.username,
                    'post_id': post.id,
                    'edit_url': url_for('posts.edit_post', post_id=post.id),
                    'delete_url': url_for('posts.delete_post', post_id=post.id)
                }

                posts_array.append(post_data)

            return jsonify({'posts': posts_array}), 200
        else:
             return jsonify({
                'status': 'error', 
                'message': f'No posts were found under the category "{category}". Please check other categories'
            }), 404
    else:
        print('this is me in the else block')
        posts = Post.query.order_by(desc(Post.date_posted)).all()
        if posts:
            posts_array = []
            for post in posts:
                print('post_title', post.title)
                post_data = {
                    'title': post.title,
                    'content': post.content,
                    'created_at':post.date_posted.strftime('%d%b %Y').capitalize(),
                    'author': post.author.username,
                    'post_id': post.id,
                    'edit_url': url_for('posts.edit_post', post_id=post.id),
                    'delete_url': url_for('posts.delete_post', post_id=post.id)
                }
                posts_array.append(post_data)

            return jsonify({'status': 'success', 'posts': posts_array}), 200
        else:
            return jsonify({'status': 'error', 'message': 'No posts were found, Try creating a new post'}), 404


@posts.route("/edit-post/<int:post_id>", methods=["GET", "PUT", "POST"])
@login_required
def edit_post(post_id):


    user_post = Post.query.get_or_404(post_id)
    if user_post.author != current_user:
        abort(403)

    if request.method == 'PUT':
        print('Handling PUT request')
        try:
            user_post.title = request.get_json().get('postTitle').strip()
            user_post.content = request.get_json().get('postContent').strip()
            db.session.commit()
            return jsonify({'status': 'success', 'message': 'Your post was successfully updated', 'redirect_url': url_for('main.index_page')}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500

    return render_template("edit_post.html", post_id=post_id)




@posts.route('/post-details/<int:post_id>', methods=['GET'])
def post_details(post_id):
    print('hellow from details')
    post = Post.query.get_or_404(post_id)
    return jsonify({'status': 'success', 'post_title': post.title, 'post_content': post.content}), 200


@posts.route("/delete/<int:post_id>", methods=["GET", "POST"])
def delete_post(post_id):

    user_post = Post.query.get_or_404(post_id)

    db.session.delete(user_post)

    db.session.commit()

    return redirect(url_for("main.index_page"))
