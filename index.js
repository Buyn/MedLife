// Write Javascript code!
const appDiv = document.getElementById('app');
appDiv.innerHTML = ``;
var butend = document.createElement("button"),
  butendless = document.createElement("button"),
  cv = document.createElement("canvas"),
  ctx = cv.getContext("2d")
butend.innerText = "End Turn"
butend.onclick = endTurn
appDiv.append(butend)
butendless.innerText = "EndLess Turn"
butendless.onclick = endlessTurn()
appDiv.append(butendless)

appDiv.append(cv)
cv.setAttribute("height", 800)
cv.setAttribute("width", 800)
/*var cellSize    = 8,
    boardHeight = 10,
    boardWidth  = 10*/
// Box width
var bw = 800;
var cog = console.log
// Box height
var bh = 800;
// cell Size
var cs = 8, 
csh = cs / 2, 
xmax = bw/cs ,
ymax = bh/cs ,
turndelai = 70

// Padding
var p = 0;
function createBoard(){
  return new Array(ymax).fill(0).map(() => new Array(xmax).fill(0))
}
var boardcells = createBoard()
var boardcellsNew = createBoard()
//console.log(boardcells)
ctx.moveTo(0, 0);
ctx.lineWidth = 0.1; // толщина линии

function Player(num, color) {
  this.num = num
  this.color = color
  this.hue = 0
}
var players = [new Player(10, "green")],
  activePlayer = 0
Player.prototype.toggleCell = function (x, y) {
  if (!boardcells[x][y]) setCellLife(x, y, this.num)
  else setCellDead(x, y)
  drawCoin(x, y)
}

function getCellByCoord(x, y) {
  return [Math.floor((x + csh) / cs), Math.floor((y + csh) / cs)]
}
function drawCoin(x, y) {
  var cellvalue = boardcells[x][y]
  if (cellvalue >= 10) {
    ctx.beginPath()
    ctx.arc(x * cs, y * cs, cs / 2, 0, 2 * Math.PI)
    ctx.fillStyle = players[cellvalue - 10].color
    ctx.closePath();
    ctx.fill()
  }
  else {
    ctx.beginPath()
    ctx.arc(x * cs, y * cs, cs / 2, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.closePath();
    ctx.fill()
  }
}
function setCellLife(x, y, pp) {
  boardcells[x][y] = pp
}
function setCellDead(x, y) {
  boardcells[x][y] = null
}
function trigerCell(x, y) {
  if (!boardcells[x][y]) setCellLife(x, y, 1)
  else setCellDead(x, y)
  drawCoin(x, y)
}

cv.onclick = function (e) {
  var x = e.offsetX, y = e.offsetY;
  [x, y] = getCellByCoord(x, y)
  //trigerCell(x,y)
  players[activePlayer].toggleCell(x, y)
}

function drawBoard() {
  ctx.fillStyle = "cornsilk"
  //ctx.fillStyle = "rgba(255,248,220,0.1)"
  ctx.fillRect(0,0,bw,bh)
  ctx.beginPath()
  ctx.moveTo(0, 0);
  ctx.lineWidth = 0.1; // толщина линии
  ctx.beginPath()
  for (var x = 0; x <= bw; x += cs) {
    ctx.moveTo(0.5 + x + p, p);
    ctx.lineTo(0.5 + x + p, bh + p);
  }

  for (var x = 0; x <= bh; x += cs) {
    ctx.moveTo(p, 0.5 + x + p);
    ctx.lineTo(bw + p, 0.5 + x + p);
  }
  ctx.strokeStyle = "black";
  ctx.closePath();
  ctx.stroke();
}
drawBoard();

function endlessTurn(){
  var on =false, i
  return function (){
    if (!on) {
      i = setInterval(endTurn,turndelai) 
      on = !on
      }
    else {
      clearInterval(i)
      on = !on
      }
      false
    }
  }

function changeColor(oldcolor){

}

function endTurn() {
  doForEach(10, processCell)
  doForEach(3, giveBirth)
  boardcells = boardcellsNew
  boardcellsNew = createBoard()
  //drawBoard();
  players[0].color = "hsl("+(players[0].hue++)+",90%,60%)"
  doForEach(10, drawCoin)
  }
function doForEach(num, dofun) {
  for (let x = 0; x < bh / cs; x++) {
    var y = -1
    do {
      y = boardcells[x].indexOf(num, y + 1)
      if (y != -1) dofun(x, y)
    } while (y != -1)
  }
  }
function giveBirth(x, y) {
  var parents = countLifeNegborsExt(x, y),
    result
  for (let k in parents) {
    if (!result) result = k
    if (parents[k] > parents[result]) result = k
  }
  boardcellsNew[x][y] = +result
}

function processCell(x, y) {
  //console.log(x,y)
  incCellBirth( x, y)
  var temp = countLifeNegborsInclude(x,y)
  if (temp == 3 || temp == 4) cellSurvive( x, y)
}
function cellSurvive(x, y) {
  boardcellsNew[x][y] = boardcells[x][y]
}
function getNegbors(x, y) {
  return [
  [x? x-1 : xmax-1, y? y-1 : ymax-1],  [x, y? y-1 : ymax-1],  [x-xmax+1? x+1 : 0, y? y-1 : ymax-1],
  [x? x-1 : xmax-1, y],                [x, y],                [x-xmax+1? x+1 : 0, y],
  [x? x-1 : xmax-1, y-ymax+1? y+1 : 0],[x, y-ymax+1? y+1 : 0],[x-xmax+1? x+1 : 0, y-ymax+1? y+1 : 0]
  ]
}

function isCellDead(x, y) {
  //cog(boardcells[x][y])
  if (boardcells[x][y] >= 10) return false
  else return true
}

function countLifeNegborsInclude(x, y) {
  var result = 0
  getNegbors(x, y).forEach(function ([nx,ny]) {
    if (!isCellDead(nx,ny)) result++
  })
  return result
}
function countLifeNegborsExt(x, y) {
  //var result = []
  return getNegbors(x, y)
    .map(coord => boardcells[coord[0]][coord[1]] + "")
    .reduce(function (result, i) {
      if (i >= 10) {
        result[i] = result[i] ? result[i] + 1 : 1
      }
      return result
    }, {})
}

function incCellBirth(x, y) {
  getNegbors(x, y).forEach(function ([nx,ny]) {
    if (!isCellDead(nx,ny)) return
    else
          boardcells[nx][ny]++
  })
}
