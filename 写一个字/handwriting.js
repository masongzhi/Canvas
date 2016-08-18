/**
 * Created by masongzhi on 2016/8/18.
 */
var canvasWidth = Math.min(800,$(window).width()-20);
var canvasHeight = canvasWidth;

var isMouseDown = false;
var lastLoc = { x:0 , y:0 };
var lastTime = 0;
var lastLineWidth = -1;
var strokeColor = "black";


var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;
$("#controller").css("width",canvasWidth+"px");

drawPane();
//适应移动端封装函数
function beginStroke(point){
    isMouseDown = true;
    lastLoc = getCanvasXY(point.x ,point.yY);
    lastTime = new Date().getTime();
}
function endStroke(point){
    isMouseDown = false;
}
function moveStroke(point){
    if (isMouseDown == true){
        curLoc = getCanvasXY(point.x , point.y);
        curTime = new Date().getTime();
        painting();
    }

}
//移动端touch事件
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke( {x:touch.pageX , y:touch.pageY} )
})
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (isMouseDown){
        touch = e.touches[0];
        moveStroke( {x:touch.pageX , y:touch.pageY} )
    }
})
canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    endStroke();
})



//鼠标事件
canvas.onmousedown = function(e){
    e.preventDefault();
    beginStroke( {x: e.clientX , y: e.clientY} );
}

canvas.onmouseup = function(e){
    e.preventDefault();
    endStroke();
}
canvas.onmouseout = function(e){
    e.preventDefault();
    endStroke();
}
canvas.onmousemove = function(e){
    e.preventDefault();
    moveStroke( {x: e.clientX , y: e.clientY} );
}
//清除画布

$("#clear_btn").click(
    function(){
    context.clearRect( 0 , 0 , canvasWidth , canvasHeight );
    drawPane();
    }
)

//选取画笔颜色
$(".color_btn").click(
    function(e){
        $(".color_btn").removeClass("color_btn_selected");
        $(this).addClass("color_btn_selected");
        strokeColor = $(this).css("background-color");
    }
)




//获取鼠标坐标并返回在canvas的坐标
function getCanvasXY(x,y){
    var canvasBox = canvas.getBoundingClientRect();
    return {x: Math.round(x - canvasBox.left) , y: Math.round(y - canvasBox.top)}
}
//计算lineWidth大小
function curLineWidth(){
    //根据速度计算lineWidth大小
    var curLineWidth;
    var s = pDistense(lastLoc,curLoc);
    var t = curTime - lastTime;
    var v = s/t;
    if ( v<=0.1 ){
        curLineWidth = 30
    }else if( v>=10 ){
        curLineWidth = 1
    }else {
        curLineWidth = 30-(v-0.1)/(9.9)*29
    }

    //让线条更加平滑
    if (lastLineWidth == -1) {
        return curLineWidth;

    }else if (curLineWidth > lastLineWidth*6/5){
        return lastLineWidth*6/5;

    }else if (curLineWidth < lastLineWidth*5/6){
        return lastLineWidth*5/6;

    }else {
        return curLineWidth;
    }
}

//绘画
function painting(){
    var resultWidth = curLineWidth();

    context.save()
    context.beginPath()
    context.moveTo( lastLoc.x , lastLoc.y )
    context.lineTo( curLoc.x , curLoc.y )
    context.lineCap = "round"
    context.closePath()

    context.strokeStyle = strokeColor
    context.lineWidth = resultWidth
    context.lineJoin = "round"
    context.stroke()
    context.restore()

    lastLoc = curLoc;
    lastTime = curTime;
    lastLineWidth = resultWidth;
}

//计算两点之间的距离
function pDistense(a,b){
    //(x1-x2)^2+(y1-y2)^2,再开根号
    return Math.sqrt( (a.x-b.x)*(a.x-b.x) + (a.y-b.y)*(a.y-b.y) );
}



//绘制方格
function drawPane(){
    context.save()
    context.strokeStyle = "#FF3F2D"

    context.beginPath()
    context.moveTo( 3 , 3)
    context.lineTo( canvasWidth-3 , 3)
    context.lineTo( canvasWidth-3 , canvasHeight-3)
    context.lineTo( 3 , canvasHeight-3)
    context.closePath()

    context.lineWidth = 6
    context.stroke()

    context.beginPath()
    context.moveTo( 3 , canvasHeight/2)
    context.lineTo( canvasWidth-3 , canvasHeight/2)
    context.moveTo( 3 , 3 )
    context.lineTo( canvasWidth-3 , canvasHeight-3)
    context.moveTo( canvasWidth/2 , 3)
    context.lineTo( canvasWidth/2 , canvasHeight-3)
    context.moveTo( canvasWidth-3 , 3)
    context.lineTo( 3 , canvasHeight-3)
    context.closePath()

    context.lineWidth = 1
    context.stroke()
    context.restore()
}
//绘制方格完