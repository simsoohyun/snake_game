var App = new Object();

// ===========================================
// @brief : Vanila JS로 만든 snake game
// @details : 게임을 시작하면 사과가 랜덤하게 생성되고 뱀이 사과를 먹으면 뱀의 꼬리가 길어지고 스피드도 빨라진다.
// @author : 심수현
// @date : 2022-06-20
// @version : 0.1
// ===========================================

App.snakeGame = (function () {
  var self;
  var y, x; // player
  var score;
  var keepMove;
  var direction; // 0 1 2 3 상 하 좌 우
  var snakeQueue = new Array();
  var wallColor = "rgb(250, 180, 50)";
  var tileColor = "rgb(255, 228, 178)";
  var appleX;
  var appleY;

  return {
    //======================================================================
    // @brief : 초기 설정
    //======================================================================
    init: function (opt) {
      // 키보드 입력 이벤트 처리
      document.onkeydown = keyDownEventHandler;
      function keyDownEventHandler(e) {
        if (e.keyCode == 38 && direction != 1) direction = 0;
        // up
        else if (e.keyCode == 40 && direction != 0) direction = 1;
        // down
        else if (e.keyCode == 37 && direction != 3) direction = 2;
        // left
        else if (e.keyCode == 39 && direction != 2) direction = 3; // right
      }

      document.getElementById("restart").addEventListener("click", function () {
        self.restart();
      });

      // 초기값 셋팅 관심
      self = this;
      settings = opt;

      fieldY = settings.fieldY; // 보드의 크기를 옵션으로 정의해서 실행문에서 적용 가능
      fieldX = settings.fieldX; // 보드의 크기를 옵션으로 정의해서 실행문에서 적용 가능

      score = 0;
      direction = -1;
      speed = 194;
      y = parseInt(fieldY / 2);
      x = parseInt(fieldX / 2);
      // SnakeGame 실행 관심
      self.run();
    },
    //======================================================================
    // @brief : 실행 함수 - 보드를 그리고(drawBoard) 벽을 그리고(drawWall) 뱀과 사과를 위치시키고(setSnake, setApple) 뱀을 움직이게 함(move)
    //======================================================================
    run: function () {
      self = this;
      self.drawBoard();
      self.drawWall();

      self.setSnake(y, x);
      self.setApple();

      keepMove = setInterval(function () {
        self.move(direction);
      }, speed);
    },
    //======================================================================
    // @brief : 보드 그리기
    //======================================================================
    drawBoard: function () {
      var boardTag = "<table border=0px>";
      for (var i = 0; i < fieldY; i++) {
        boardTag += "<tr>";
        for (var j = 0; j < fieldX; j++)
          boardTag += '<td id="' + String(i) + " " + String(j) + '"></td>';
        boardTag += "</tr>";
      }
      boardTag += "</table>";
      document.write(boardTag);
    },
    //======================================================================
    // @brief : 벽 그리기
    //======================================================================
    drawWall: function () {
      var wallCell = new Array();
      for (var i = 0; i < fieldY; i++) wallCell.push(new Array(i, 0));
      for (var i = 0; i < fieldY; i++) wallCell.push(new Array(i, fieldX - 1));
      for (var i = 0; i < fieldX; i++) wallCell.push(new Array(0, i));
      for (var i = 0; i < fieldX; i++) wallCell.push(new Array(fieldY - 1, i));
      for (var i = 0; i < wallCell.length; i++) {
        var wallY = wallCell[i][0];
        var wallX = wallCell[i][1];
        document.getElementById(
          String(wallY) + " " + String(wallX)
        ).style.background = wallColor;
        document.getElementById(
          String(wallY) + " " + String(wallX)
        ).style.borderRadius = "2px";
      }
    },
    //======================================================================
    // @brief : 뱀 그리기
    // @param : 뱀의 좌표
    //======================================================================
    setSnake: function (y, x) {
      snakeQueue.push(Array(y, x));
      document.getElementById(String(y) + " " + String(x)).style.background =
        "rgb(255, 228, 178) url(./img/icon-snake.png) no-repeat center";
      document.getElementById(String(y) + " " + String(x)).style.borderRadius =
        "0px";
      console.log(y);
    },
    //======================================================================
    // @brief : 뱀 지우기
    //======================================================================
    removeSnake: function () {
      var tileY = snakeQueue[0][0];
      var tileX = snakeQueue[0][1];
      snakeQueue.shift();
      document.getElementById(
        String(tileY) + " " + String(tileX)
      ).style.background = tileColor;
      document.getElementById(
        String(tileY) + " " + String(tileX)
      ).style.borderRadius = "0px";
    },
    //======================================================================
    // @brief : 사과의 위치 지정
    //======================================================================
    isApple: function () {
      return y == appleY && x == appleX;
    },
    //======================================================================
    // @brief : 사과의 좌표를 랜덤으로 생성하기
    //======================================================================
    setApple: function () {
      self = this;
      do {
        var rand = parseInt(Math.random() * ((fieldY - 2) * (fieldX - 2)));
        appleY = parseInt(rand / (fieldX - 2)) + 1;
        appleX = (rand % (fieldX - 2)) + 1;
      } while (self.isInQueue(appleY, appleX));
      document.getElementById(
        String(appleY) + " " + String(appleX)
      ).style.background =
        "rgb(255, 228, 178) url(./img/free-icon-apple-1202063.png) no-repeat center";
    },
    //======================================================================
    // @brief : 사과 먹기
    //======================================================================
    eatApple: function () {
      self = this;
      if (self.isApple()) {
        score += 10 * (snakeQueue.length - 1);
        speed = speed - 1.5 * (snakeQueue.length - 1);
        clearInterval(keepMove);
        keepMove = setInterval(function () {
          self.move(direction);
        }, speed);
        self.setApple();
        self.showPlus();
      } else {
        self.removeSnake(y, x);
      }
    },
    //======================================================================
    // @brief : 사과를 먹으면 플러스 점수 생성하기
    //======================================================================
    showPlus: function () {
      var plusedScore = 10 * (snakeQueue.length - 1);
      document.getElementById("plus").innerHTML = "+" + plusedScore;

      setTimeout(function () {
        document.getElementById("plus").innerHTML = "";
      }, 500);
    },
    //======================================================================
    // @brief : 뱀 움직이기
    // @param : 상하좌우 방향키의 값
    //======================================================================
    move: function (direction) {
      self = this;
      switch (direction) {
        case 0:
          y -= 1;
          break;
        case 1:
          y += 1;
          break;
        case 2:
          x -= 1;
          break;
        case 3:
          x += 1;
          break;
        default:
          return;
      }
      if (self.isInvalidMove(y, x)) self.gameover();
      self.setSnake(y, x);
      self.eatApple();
      self.scoring();
    },
    //======================================================================
    // @brief : 뱀 충돌 관련 함수
    // @param : 뱀의 좌표
    //======================================================================
    isInvalidMove: function (y, x) {
      self = this;
      return (
        y == 0 ||
        y == fieldY - 1 ||
        x == 0 ||
        x == fieldX - 1 ||
        self.isCollapsed(y, x)
      );
    },
    isCollapsed: function (y, x) {
      self = this;
      if (self.isInQueue(y, x)) return true;
      return false;
    },
    isInQueue: function (y, x) {
      var p = new Array(y, x);
      for (var i = 0; i < snakeQueue.length; i++) {
        if (snakeQueue[i][0] == p[0] && snakeQueue[i][1] == p[1]) {
          return true;
        }
      }
      return false;
    },
    //======================================================================
    // @brief : 게임 오버 관련 함수
    //======================================================================
    gameover: function () {
      document.getElementById("gameover-box").style.display = "block";
      document.querySelector(".score").style.display = "none";
      clearInterval(keepMove);
      return;
    },
    //======================================================================
    // @brief : 점수를 html로 표현하기
    //======================================================================
    scoring: function () {
      document.getElementById("score").innerHTML = score;
      document.getElementById("final-score").innerHTML = score;
    },
    //======================================================================
    // @brief : 게임이 끝나면 재시작
    //======================================================================
    restart: function () {
      self = this;
      self.run();
      location.reload();
    },
  };
})();

//======================================================================
// 실행문
//======================================================================
App.snakeGame.init({
  fieldY: 17,
  fieldX: 17,
});
