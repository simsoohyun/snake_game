var y,x; // player
var MY=17, MX=17; // 필드 크기
var keepMove;
var direction; // 0 1 2 3 상 하 좌 우
var snakeQueue = new Array();
var wallColor = "rgb(250, 180, 50)",
    snakeColor = "rgb(0, 84, 0)",
    appleColor = "rgb(201, 3, 3)",
    tileColor = "rgb(255, 228, 178)";

init();

// 키보드 입력 이벤트 처리
document.onkeydown = keyDownEventHandler;
function keyDownEventHandler(e){
    if(e.keyCode==38 && direction!=1) direction = 0; // up
    else if(e.keyCode==40 && direction!=0) direction = 1; // down
    else if(e.keyCode==37 && direction!=3) direction = 2; // left
    else if(e.keyCode==39 && direction!=2) direction = 3; // right
    // move(direction);
}

// 초기 설정
function init(){
  drawBoard();
  drawWall();
  y=parseInt(MY/2);
  x=parseInt(MX/2);
  setSnake(y,x);
  setApple();
  direction=-1;
  speed=200;
  keepMove = setInterval("move(direction)",speed);

}

// 보드판 표시
function drawBoard(){
  var boardTag = "<table border=0px>";
  for(var i=0;i<MY;i++){
      boardTag += "<tr>";
      for(var j=0;j<MX;j++)
          boardTag += "<td id=\""+String(i)+" "+String(j)+"\"></td>";
      boardTag += "</tr>";
  }
  boardTag += "</table>"
  document.write(boardTag);
}
// 벽 표시
function drawWall(){
  var wallCell = new Array();
  for(var i=0;i<MY;i++) wallCell.push(new Array(i,0));
  for(var i=0;i<MY;i++) wallCell.push(new Array(i,MX-1));
  for(var i=0;i<MX;i++) wallCell.push(new Array(0,i));
  for(var i=0;i<MX;i++) wallCell.push(new Array(MY-1,i));
  for(var i=0;i<wallCell.length;i++){
      var wy = wallCell[i][0];
      var wx = wallCell[i][1];
      document.getElementById(String(wy)+" "+String(wx)).style.background = wallColor;
      document.getElementById(String(wy)+" "+String(wx)).style.borderRadius = "2px";

  }
}

// 뱀 표시
function setSnake(y,x){
  snakeQueue.push(Array(y,x));
  document.getElementById(String(y)+" "+String(x)).style.background = snakeColor;
  document.getElementById(String(y)+" "+String(x)).style.borderRadius = "0px";
  
}
function removeSnake(){
  var ty = snakeQueue[0][0];
  var tx = snakeQueue[0][1];
  snakeQueue.shift();
  document.getElementById(String(ty)+" "+String(tx)).style.background = tileColor;
  document.getElementById(String(ty)+" "+String(tx)).style.borderRadius = "0px";
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
}

// 사과 먹는 함수
function eatApple(){
  if(isApple()){
      setApple();
  }
  else{
      removeSnake(y,x);
  }
}

// 뱀 충돌 관련 함수
function isInvalidMove(y,x){
  return (y==0||y==MY-1||x==0||x==MX-1) || isCollapsed(y,x);
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
      var rand = parseInt(Math.random()*((MY-2)*(MX-2))); 113
      ay=parseInt(rand/(MX-2))+1;
      ax=rand%(MX-2)+1;
  }while(isInQueue(ay,ax))
  document.getElementById(String(ay)+" "+String(ax)).style.background = appleColor;
  document.getElementById(String(ay)+" "+String(ax)).style.borderRadius = "6px";
}
function isApple(){
  return (y==ay && x==ax);
}

// 게임 오버
function gameover(){
    alert("[Game Over]");
    init();
    location.reload();
}