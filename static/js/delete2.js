var canvas = document.getElementById("main");//canvasを読み込む
var ctx = canvas.getContext("2d");
var px = 40    //player x座標
var py = 300    //player y座標

var p_dx = 0    //player xの速さ
var p_dy = 0    //player yの速さ
var ps = 30

//レーザーの座標
var lx =[0];   //レーザーをたくさん描けるようにするためリストにする
var ly = [0];
var lw = 16
var lh = 5

//enemyの座標
var ex = [0];
var ey = [0];
var es = 36

//fireの座標
var fx = [0];
var fy = [0];
var fs = [0]; //fps?

var p = 0; //点数（ポイント）

var kt = new Date(); //時間

//playerを描く関数
function player_draw(){
    var player_img = new Image()
    player_img.src="/static/images/player.png"
    ctx.drawImage(player_img,px,py,ps,ps)
}

function l_draw(){
    for(var i = 0;i < lx.length;i++){
        ctx.beginPath()
        ctx.rect(lx[i],ly[i],lw,lh)
        ctx.fillStyle = "#ff0000"
        ctx.fill()
        ctx.closePath()
    }
}
function e_draw(){
    for(var i = 0;i < ex.length;i++){
        var enemy_img = new Image()
        enemy_img.src = "/static/images/enemy.png"
        ctx.drawImage(enemy_img,ex[i],ey[i],enemy_img.naturalWidth,enemy_img.naturalHeight)
    }
}
function p_draw(){
    ctx.font = "35px UTF-8"
    ctx.fillStyle="#ffff00"
    ctx.fillText(p,0,35)
}
function f_draw(){ //引数に座標位置を受け取る
    for(var i = 0;i < fx.length;i++){
        var fire_img = new Image()
        fire_img.src = "/static/images/fire.png"
        ctx.drawImage(fire_img,fx[i],fy[i],fire_img.naturalWidth,fire_img.naturalHeight)
        fs[i]--;
        if(fs[i]==0){
            fx.splice(l_return[1],1)
            fy.splice(l_return[1],1)
            fs.splice(i,1)
        } 
    }
    
}


function l_collision(){
    var collision = false   //衝突したか
    var collision_n = 0  //衝突したenemyの個体番号
    for(var i = 0;i < lx.length;i++){
        for(var j = 0;j < ex.length;j++){
            if(ey[j] + es > ly[i]&& ex[j] + es >lx[i] &&ey[j] < ly[i]+lh&& ex[j] < lx[i]+lw){
                console.log("衝突しました!")
                collision = true
                collision_n = j //個体番号を衝突した個体番号にする
                p += 1; //ポイントを1増やす
            }
        }
    }
    return [collision,collision_n]
}
//キーが押されたときに実行される
document.onkeydown = function(e){
    if(e.key == "ArrowUp"){  //↑
        p_dx = 0
        p_dy = -3
        lx.push(px)    //レーザー発射開始位置(playerの位置)をリストに追加
        ly.push(py)
    }
    if(e.key == "ArrowDown"){//↓
        p_dx = 0
        p_dy = 3
        lx.push(px)    //レーザー発射開始位置(playerの位置)をリストに追加
        ly.push(py)
    }
    if(e.key == " "){
        lx.push(px)    //レーザー発射開始位置(playerの位置)をリストに追加
        ly.push(py)
    }
    
}
//キーが離されたときに実行される
document.onkeyup = function(e){
    p_dx = 0    //止める
    p_dy = 0
}

function draw(){
    ctx.clearRect(0/*開始地点*/,0,canvas.width/*終了地点*/,canvas.height)   //canvasをいったんクリアする
    player_draw()
    l_draw()
    e_draw()
    p_draw()
    f_draw()
    var l_return = l_collision()   //衝突した個体番号などをl_returnに収納
    if(l_return[0]){
        //ぶつかった個体を削除する(リストから削除する)!!!!!!!!!!!!
        fx.push(ex[l_return[1]])
        fy.push(ey[l_return[1]])
        fs.push(60)
        ex.splice(l_return[1],1)
        ey.splice(l_return[1],1)
    }
    for(var i = 0;i < lx.length/*リストの長さ*/;i++){   //リストを読み込む
        lx[i] += 1.7  //今読み込んでいるレーザーを動かす
    }
    e_draw()
    for(var i = 0;i < ex.length/*リストの長さ*/;i++){   //リストを読み込む
        ex[i] -= 1.7  //今読み込んでいるenemyを動かす
    }

    var t = new Date(); //今の時間（ミリ秒）を取得 
    if(t.getTime()-kt.getTime() >=10000){ //今の時間 >= 10秒
        clearInterval(mg)
        game_over()
    }
    
    //playerを動かす
    px += p_dx
    py += p_dy
}
var mg = setInterval(draw,10)    //10ミリ秒単位で実行

function game_over(){
    ctx.font = "50px UTF-8"
    ctx.fillStyle="#ffff00"
    ctx.fillText(p+ " complaints are gone!",10,200)
}

//enemyをランダムな座標に作る
function e_make(){
    ex.push(700)
    ey.push(Math.floor(Math.random()*370)) //0~369
}
setInterval(e_make,150) //n[ms]おきに実行

draw();