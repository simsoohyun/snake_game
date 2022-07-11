// ===========================================
// @brief : Vanila JS로 만든 snake game
// @details : 게임을 시작하면 사과가 랜덤하게 생성되고 뱀이 사과를 먹으면 뱀의 꼬리가 길어지고 스피드도 빨라진다.
// @author : 심수현
// @date : 2022-06-20
// @version : 0.1
// ===========================================


document.addEventListener("DOMContentLoaded", function () {
  App.snakeGame.init();

  // ===========================================
      // @brief : 키보드 입력 이벤트 처리
      // @param : 이벤트
  // ===========================================
  document.onkeydown = keyDownEventHandler;
  function keyDownEventHandler(e){
      if(e.keyCode==38 && direction!=1) direction = 0; // up
      else if(e.keyCode==40 && direction!=0) direction = 1; // down
      else if(e.keyCode==37 && direction!=3) direction = 2; // left
      else if(e.keyCode==39 && direction!=2) direction = 3; // right
  }

  document.getElementById("restart").addEventListener('click', function() {
    restart();
  })
});

var App = new Object();

App.snakeGame = (function (){
  var self;

  var y,x; // player
  var fieldY=17, fieldX=17; // 필드 크기
  var score;
  var keepMove;
  var direction; // 0 1 2 3 상 하 좌 우
  var snakeQueue = new Array();
  var wallColor = "rgb(250, 180, 50)",
      tileColor = "rgb(255, 228, 178)";

  return{
    // ===========================================
    // 초기 설정
    // ===========================================
    init: function() {
      self = this;
      score=0; // 점수 초기화
      direction=-1; // 방향 초기화
      speed=194;  // 속도 지정
      y=parseInt(fieldY/2); // 초기화 되었을때 정중앙에 위치시킴
      x=parseInt(fieldX/2); // 초기화 되었을때 정중앙에 위치시킴

      self.drawBoard(); // 보드판 그리기
      self.drawWall();  // 벽 그리기
      self.setSnake(y,x); // 뱀을 위치시키는 함수
      self.setApple(); // 사과를 위치시키는 함수

      keepMove = setInterval("move(direction)",speed);
    },
    // ===========================================
    // @breif : 보드판 그리기
    // ===========================================
    drawBoard: function(){
      var boardTag = "<table border=0px>";
      for(var i=0;i<fieldY;i++){
          boardTag += "<tr>";
          for(var j=0;j<fieldX;j++)
              boardTag += "<td id=\""+String(i)+" "+String(j)+"\"></td>";
          boardTag += "</tr>";
      }
      boardTag += "</table>"
      document.write(boardTag);
    },
    // ===========================================
    // @breif : 벽 그리기
    // ===========================================
    drawWall: function(){
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
    },
    // ===========================================
    // @breif : 뱀 그리기
    // ===========================================
    setSnake: function() {
      snakeQueue.push(Array(y,x));
      document.getElementById(String(y)+" "+String(x)).style.background = "rgb(255, 228, 178) url(./img/icon-snake.png) no-repeat center";
      document.getElementById(String(y)+" "+String(x)).style.borderRadius = "0px";
    },
    // ===========================================
    // @breif : 뱀 꼬리 지우기
    // ===========================================
    removeSnake: function() {
      var tileY = snakeQueue[0][0];
      var tileX = snakeQueue[0][1];
      snakeQueue.shift();
      document.getElementById(String(tileY)+" "+String(tileX)).style.background = tileColor;
      document.getElementById(String(tileY)+" "+String(tileX)).style.borderRadius = "0px";
    },
    // ===========================================
    // @breif : 뱀 조작
    // @param : direction
    // ===========================================
    move: function(direction) {
      switch(direction){
          case 0: y-=1; break;
          case 1: y+=1; break;
          case 2: x-=1; break;
          case 3: x+=1; break;
          default: return;
      }
      if(self.isInvalidMove(y,x)) self.gameover();
      self.setSnake(y,x);
      self.eatApple();
      self.scoring();
    },
    // ===========================================
    // @breif : 사과먹는 함수
    // ===========================================
    eatApple: function() {
      if(self.isApple()){
        score+=10*(snakeQueue.length-1);
        speed = speed - 1.5*(snakeQueue.length-1);
        clearInterval(keepMove);
        keepMove = setInterval("move(direction)",speed);
        self.setApple();
        self.showPlus();
      }
      else{
          self.removeSnake(y,x);
      }
    },
    // ===========================================
    // @breif : 플러스되는 점수가 보이는 함수
    // ===========================================
    showPlus: function() {
      var plusedScore=10*(snakeQueue.length-1);
      document.getElementById("plus").innerHTML = "+"+plusedScore;
      setTimeout("document.getElementById(\"plus\").innerHTML=\"\"",500); 
    },
    // ===========================================
    // @breif : 뱀 충돌 관련 함수
    // @param : y, x
    // ===========================================
    isInvalidMove: function(y,x) {
      return (y==0||y==fieldY-1||x==0||x==fieldX-1) || self.isCollapsed(y,x);
    },
    isCollapsed: function(y,x) {
      if(self.isInQueue(y,x)) return true;
      return false;
    },
    isInQueue: function(y,x) {
      var p = new Array(y,x);
      for(var i=0;i<snakeQueue.length;i++) {
          if(snakeQueue[i][0]==p[0] && snakeQueue[i][1]==p[1]) {
              return true;
          }
      }
      return false;
    },
    // ===========================================
    // @breif : 먹이 생성 및 충돌
    // ===========================================
    setApple: function() {
      do{
          var rand = parseInt(Math.random()*((fieldY-2)*(fieldX-2)));
          appleY=parseInt(rand/(fieldX-2))+1;
          appleX=rand%(fieldX-2)+1;
      }while(self.isInQueue(appleY,appleX))
      document.getElementById(String(appleY)+" "+String(appleX)).style.background = "rgb(255, 228, 178) url(./img/free-icon-apple-1202063.png) no-repeat center";
    },
    isApple: function() {
      return (y==appleY && x==appleX);
    },
    // ===========================================
    // @breif : 점수 반영
    // ===========================================
    scoring: function() {
      document.getElementById("score").innerHTML = score;
      document.getElementById("final-score").innerHTML = score;
    },
    // ===========================================
    // @breif : 게임 오버
    // ===========================================
    gameover: function() {
      document.getElementById("gameover-box").style.display = "block";
      document.querySelector(".score").style.display = "none";
      clearInterval(keepMove);
      return;
    },
    // ===========================================
    // @breif : 게임 재시작
    // ===========================================
    restart: function() {
      self.init();  
      location.reload();
    }
      


  }
  
})

