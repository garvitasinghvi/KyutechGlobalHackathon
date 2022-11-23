from datetime import datetime,date
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

import PIL.Image
import PIL.ImageDraw
import PIL.ImageFont

app = Flask(__name__, static_folder='./static')
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///complaints.db'
db = SQLAlchemy(app)


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(30), nullable=False)


@app.route('/',methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        posts = Post.query.all()
        return render_template('index.html', posts=posts)
    else:
        title = request.form.get('title')
        new_post = Post(title=title)
        db.session.add(new_post)
        db.session.commit()
        return redirect('/')


@app.route('/create')
def create():
    return render_template('create.html')

@app.route('/delete/<int:id>')
def delete(id):
    post = Post.query.get(id)

    db.session.delete(post)
    db.session.commit()
    return redirect('/')

@app.route('/delete1/<int:id>')
def delete1(id):
    post = Post.query.get(id)
    return render_template('delete1.html', post=post)

@app.route('/delete2/<int:id>')
def delete2(id):
    post = Post.query.get(id)

    # 使うフォント，サイズ，描くテキストの設定
    ttfontname = "C:\\Windows\\Fonts\\meiryob.ttc"
    fontsize = 20

    # !!!!!!!!!
    text = post.title # テキスト指定
    # !!!!!!!!!

    # 画像サイズ，背景色，フォントの色を設定
    canvasSize    = (64, 64)
    textRGB = (255, 255, 255)
    backgroundRGB = (0, 0, 0)
    # 文字を描く画像の作成
    img  = PIL.Image.new('RGB', canvasSize, backgroundRGB)
    draw = PIL.ImageDraw.Draw(img)
    # 用意した画像に文字列を描く
    font = PIL.ImageFont.truetype(ttfontname, fontsize)
    textWidth, textHeight = draw.textsize(text,font=font)
    # リサイズ
    canvasSize = (textWidth, textHeight)
    # 文字を描く画像の作成
    img  = PIL.Image.new('RGB', canvasSize, backgroundRGB)
    # 背景透過
    img.putalpha(0)
    draw = PIL.ImageDraw.Draw(img)
    # 用意した画像に文字列を描く
    font = PIL.ImageFont.truetype(ttfontname, fontsize)
    textWidth, textHeight = draw.textsize(text,font=font)
    textTopLeft = (0, canvasSize[1]//2-textHeight//2) # 前から1/6，上下中央に配置
    draw.text(textTopLeft, text, fill=textRGB, font=font)

    img.save("static/images/enemy.png")
    return render_template('delete2.html', post=post)

# @app.route('/delete3/<int:id>')
# def delete3(id):
#     post = Post.query.get(id)
#     return render_template('delete3.html', post=post)

@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    post = Post.query.get(id)
    if request.method == 'GET':
        return render_template('update.html', post=post)
    else:
        post.title = request.form.get('title')
        db.session.commit()
        return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)