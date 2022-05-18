var y,x; // player
var fieldY=17, fieldX=17; // 필드 크기
var score;
var keepMove;
var direction; // 0 1 2 3 상 하 좌 우
var snakeQueue = new Array();
var wallColor = "rgb(250, 180, 50)",
    tileColor = "rgb(255, 228, 178)";

init();

// 키보드 입력 이벤트 처리
document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
    if(e.keyCode==38 && direction!=1) direction = 0; // up
    else if(e.keyCode==40 && direction!=0) direction = 1; // down
    else if(e.keyCode==37 && direction!=3) direction = 2; // left
    else if(e.keyCode==39 && direction!=2) direction = 3; // right
}

// 초기 설정
function init(){
  drawBoard();
  drawWall();
  y=parseInt(fieldY/2);
  x=parseInt(fieldX/2);
  setSnake(y,x);
  setApple();
  score=0;
  direction=-1;
  speed=194;
  keepMove = setInterval("move(direction)",speed);
}

// 보드판 표시
function drawBoard(){
  var boardTag = "<table border=0px>";
  for(var i=0;i<fieldY;i++){
      boardTag += "<tr>";
      for(var j=0;j<fieldX;j++)
          boardTag += "<td id=\""+String(i)+" "+String(j)+"\"></td>";
      boardTag += "</tr>";
  }
  boardTag += "</table>"
  document.write(boardTag);
}
// 벽 표시
function drawWall(){
  var wallCell = new Array();
  for(var i=0;i<fieldY;i++) wallCell.push(new Array(i,0));
  for(var i=0;i<fieldY;i++) wallCell.push(new Array(i,fieldX-1));
  for(var i=0;i<fieldX;i++) wallCell.push(new Array(0,i));
  for(var i=0;i<fieldX;i++) wallCell.push(new Array(fieldY-1,i));
  for(var i=0;i<wallCell.length;i++){
      var wallY = wallCell[i][0];
      var wallX = wallCell[i][1];
      document.getElementById(String(wallY)+" "+String(wallX)).style.background = wallColor;
      document.getElementById(String(wallY)+" "+String(wallX)).style.borderRadius = "2px";
  }
}

// 뱀 표시
function setSnake(y,x){
  snakeQueue.push(Array(y,x));
  document.getElementById(String(y)+" "+String(x)).style.background = "rgb(255, 228, 178) url(./img/icon-snake.png) no-repeat center";
  document.getElementById(String(y)+" "+String(x)).style.borderRadius = "0px";
}
function removeSnake(){
  var tileY = snakeQueue[0][0];
  var tileX = snakeQueue[0][1];
  snakeQueue.shift();
  document.getElementById(String(tileY)+" "+String(tileX)).style.background = tileColor;
  document.getElementById(String(tileY)+" "+String(tileX)).style.borderRadius = "0px";
}

// 뱀 조작
function move(direction){
  switch(direction){
      case 0: y-=1; break;
      case 1: y+=1; break;
      case 2: x-=1; break;
      case 3: x+=1; break;
      default: return;
  }
  if(isInvalidMove(y,x)) gameover();
  setSnake(y,x);
  eatApple();
  scoring();
}

// 사과 먹는 함수
function eatApple(){
  if(isApple()){
    score+=10*(snakeQueue.length-1);
    speed = speed - 1.5*(snakeQueue.length-1);
    clearInterval(keepMove);
    keepMove = setInterval("move(direction)",speed);
    setApple();
    showPlus();
  }
  else{
      removeSnake(y,x);
  }
}
function showPlus(){
  var plusedScore=10*(snakeQueue.length-1);
  document.getElementById("plus").innerHTML = "+"+plusedScore;
  setTimeout("document.getElementById(\"plus\").innerHTML=\"\"",500);
}

// 뱀 충돌 관련 함수
function isInvalidMove(y,x){
  return (y==0||y==fieldY-1||x==0||x==fieldX-1) || isCollapsed(y,x);
}
function isCollapsed(y,x){
  if(isInQueue(y,x)) return true;
  return false;
}
function isInQueue(y,x){
  var p = new Array(y,x);
  for(var i=0;i<snakeQueue.length;i++) {
      if(snakeQueue[i][0]==p[0] && snakeQueue[i][1]==p[1]) {
          return true;
      }
  }
  return false;
}

// 먹이 생성 및 충돌
function setApple(){
  do{
      var rand = parseInt(Math.random()*((fieldY-2)*(fieldX-2))); 113
      appleY=parseInt(rand/(fieldX-2))+1;
      appleX=rand%(fieldX-2)+1;
  }while(isInQueue(appleY,appleX))
  document.getElementById(String(appleY)+" "+String(appleX)).style.background = "rgb(255, 228, 178) url(./img/free-icon-apple-1202063.png) no-repeat center";
}
function isApple(){
  return (y==appleY && x==appleX);
}

// 점수 반영
function scoring(){
  document.getElementById("score").innerHTML = score;
  document.getElementById("final-score").innerHTML = score;
}

// 게임 오버
function gameover(){
    document.getElementById("gameover-box").style.display = "block";
    document.querySelector(".score").style.display = "none";
    clearInterval(keepMove);
    return;
}
document.getElementById("restart").addEventListener('click', function() {
  restart();
})
function restart(){
  init();  
  location.reload();
}







