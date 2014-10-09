$(document).ready(function(){
	var cnt = $('#cell-grid');
	var newGame = new Newgame(cnt);
	newGame.init();
	// $("#start").click(function(){
	// 	var newGame = new Newgame(cnt);
	// 	newGame.init();
	// });
});

function Newgame(dom){
	this.dom = dom;
	this.cell = null;
	this.board = [];
	this.score = this.dom.find('#score');
	this.scoreNum = 0;
	this.scale = this.dom.find('.m-cell').eq(0).width();
	this.space = this.dom.width()*0.04;
	this.fontStyle = (this.scale+this.space)*4>320 ? "font-size1":"font-size2";
	this.hasConflicted = [];
	this.delayTime = [50,120,150,160,200];
}
Newgame.prototype.init = function(){
	this.dom.height(this.dom.width());
	for(var i=0;i<4;i++){
		this.board[i] = [];
		this.hasConflicted[i] = [];
		for(var j=0;j<4;j++){
			this.board[i][j] = 0;
			this.hasConflicted[i][j] = false;
		}
	}
	this.updateBoardView();
	//this._setGrid();
	this.addNumCell();
	this.addNumCell();
	this.keyDown();
	this.touch();
};
//布局
Newgame.prototype._setGrid = function(){
	// for(var i=0;i<4;i++){
	// 	for(var j=0;j<4;j++){
	// 		var cell = $('#cell-'+i+'-'+j);
	// 		console.log(cell.offset().top,cell.offset().left);
	// 		cell.css({'position':'absolute','top':this.setTop(),'left':this.setLeft()});
	// 	}
	// }
};
//更新num值
Newgame.prototype.updateBoardView = function(){
	$('.m-num-cell').remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			this.dom.append('<div class="m-num-cell" id="num-cell-'+i+'-'+j+'"></div>');
			var numCell = $('#num-cell-'+i+'-'+j);
			if(this.board[i][j] == 0){
				numCell.addClass('board0');
				numCell.css({'top':this.setTop(i,j),'left':this.setLeft(i,j)});
			}else {
				numCell.addClass('m-board').addClass(this.fontStyle);
				numCell.css({'top':this.setTop(i,j),'left':this.setLeft(i,j),'background':this.setBgColor(this.board[i][j]),'color':this.setNumColor(this.board[i][j])});
				numCell.text(this.board[i][j]);
			}
			this.hasConflicted[i][j] = false;
		}
	}
};
Newgame.prototype.updateScore = function(){
	$('#score').text(this.scoreNum);
};
//随机找格子生成数字
Newgame.prototype.addNumCell = function(){
	if(!this.noSpace) return false;
	var randX = parseInt(Math.floor(Math.random()*4));
	var randY = parseInt(Math.floor(Math.random()*4));
	if(this.board[randX][randY] == 0){
		var randNum = Math.random()<0.5?2:4;
		this.board[randX][randY] = randNum;
		this.showNumWithAnimation(randX,randY,randNum);
		return true;
	}else{
		this.addNumCell();
	}
};
//检查有无空格
Newgame.prototype.noSpace = function(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(this.board[i][j]==0){
				return true;
			}
		}
	}
	return false;
};
//动画显示新产生的格子
Newgame.prototype.showNumWithAnimation = function(i,j,num){
	var _t = this;
	var numCell = $('#num-cell-'+i+'-'+j);
	numCell.css({'background':this.setBgColor(num),'color':this.setNumColor(num)}).removeClass('board0');
	numCell.addClass(this.fontStyle);
	numCell.text(num);
	numCell.animate({
		width:"21%",
		height:"21%",
		maxWidth:"100px",
		maxHeight:"100px",
		top:this.setTop(i,j),
		left:this.setLeft(i,j)
	},_t.delayTime[0]);
	var oCell = document.getElementById('num-cell-'+i+'-'+j);
	$(oCell).text(num);
};
//定位top
Newgame.prototype.setTop = function(i,j){
	return this.space+(this.space+this.scale)*i;
};
//定位left
Newgame.prototype.setLeft = function(i,j){
	return this.space+(this.space+this.scale)*j;
};
//设置背景色
Newgame.prototype.setBgColor = function(num){
	switch(num){
		case 2:return "#eee4da"; break;
		case 4:return "#ede0c8"; break;
		case 8:return "#f2b179"; break;
		case 16:return "#f59563"; break;	
		case 32:return "#f67c5f"; break;	
		case 64:return "#f65e3b"; break;
		case 128:return "#edcf72"; break;
		case 256:return "#edcc61"; break;	
		case 512:return "#9c0"; break;	
		case 1024:return "#33b5e5"; break;	
		case 2048:return "#09c"; break;
		case 4096:return "#a6c"; break;
		case 8192:return "#93c"; break;
	}
};
// 数字颜色
Newgame.prototype.setNumColor = function(num){
	if(num<=4){
		return "#776e6e";
	}
	return "white";
};
// 键盘按下事件
Newgame.prototype.keyDown = function() {
	var _t = this;
	$(document).keydown(function(event){
		switch (event.keyCode){
			case 37:
				event.preventDefault();
				if(_t.moveLeft()){
					setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
				}
				break;
			case 38:
				event.preventDefault();
				if(_t.moveUp()){
					setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
				}
				break;
			case 39:
				event.preventDefault();
				if(_t.moveRight()){
					setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
				}
				break;
			case 40:
				event.preventDefault();
				if(_t.moveDown()){
					setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
				}
				break;
			default:
				break;
		}
		setTimeout(function(){_t.isGameOver();},_t.delayTime[4]);
	});
};
// 游戏结束
Newgame.prototype.isGameOver = function(){
	if(!this.noSpace() && !this.canMoveLeft() && !this.canMoveRight() && !this.canMoveUp() && !this.canMoveDown()){
		this.gameOver();
	}
	return false;
};

Newgame.prototype.gameOver = function(){
	if (this.fontStyle == "font-size1") {$('.over').addClass("over1");return false;}
	if (this.fontStyle == "font-size2") {$('.over').addClass("over2");return false;}
};
// 向左移动
Newgame.prototype.moveLeft = function(){
	var _t = this;

	if(!_t.canMoveLeft()) return false;
	
	for(i=0;i<4;i++){
		for (var j=1;j<4;j++) {
			if(_t.board[i][j]!=0){
				for(var k=0;k<j;k++){
					// if((_t.board[i][k]==0||_t.board[i][j]==_t.board[i][k])&&_t.noBlockHorizontal(i,k,j)){
					// 	_t.showMoveAnimation(i,j,i,k);
					// 	_t.board[i][k] += _t.board[i][j];
					// 	_t.board[i][j] = 0;
					// }
					if( _t.board[i][k] == 0 && _t.noBlockHorizontal(i,k,j)){
                        _t.showMoveAnimation(i,j,i,k);
                        _t.board[i][k] = _t.board[i][j];
                        _t.board[i][j] = 0;
                        continue;
                    }
                    else if( _t.board[i][k] == _t.board[i][j] && _t.noBlockHorizontal(i,k,j) && !_t.hasConflicted[i][k] ){
                        //move
                        _t.showMoveAnimation(i,j,i,k);
                        //add
                        _t.board[i][k] += _t.board[i][j];
                        _t.board[i][j] = 0;
                        //add score
                        _t.scoreNum += _t.board[i][k];
                        _t.updateScore();

                        _t.hasConflicted[i][k] = true;
                        continue;
                    }
				}
			}
		}
	}
	setTimeout(function(){_t.updateBoardView()},_t.delayTime[2]);
	//setTimeout("_t.updateBoardView()",_t.delayTime[4]);
	return true;
};
// 向右移动
Newgame.prototype.moveRight = function(){
	var _t = this;
	if(!_t.canMoveRight()) return false;
	for(i=0;i<4;i++){
		for (var j=2;j>=0;j--) {
			if(_t.board[i][j]!=0){
				for(var k=3;k>j;k--){
					// if((_t.board[i][k]==0||_t.board[i][j]==_t.board[i][k])&&_t.noBlockHorizontal(i,k,j)){
					// 	_t.showMoveAnimation(i,j,i,k);
					// 	_t.board[i][k] += _t.board[i][j];
					// 	_t.board[i][j] = 0;
     //                    continue;
					// }
					 if(_t.board[i][k]==0 && _t.noBlockHorizontal(i,j,k) ){
                        //move
                        _t.showMoveAnimation(i,j,i,k);
                        _t.board[i][k] = _t.board[i][j];
                        _t.board[i][j] = 0;
                        continue;
                    }else if(_t.board[i][k] == _t.board[i][j] && _t.noBlockHorizontal(i,j,k) && !_t.hasConflicted[i][k] ){
                        //move
                        _t.showMoveAnimation(i,j,i,k);
                        //add
                        _t.board[i][k]+=_t.board[i][j];
                        _t.board[i][j] = 0;
                        //add score
                        _t.scoreNum += _t.board[i][k];
                        _t.updateScore();

                        _t.hasConflicted[i][k] = true;
                        continue;
                    }
				}
			}
		}
	}
	setTimeout(function(){_t.updateBoardView()},_t.delayTime[2]);
	return true;
};
// 向上移动
Newgame.prototype.moveUp = function(){
	var _t = this;
	if(!_t.canMoveUp()) return false;
	for(i=0;i<4;i++){
		for (var j=1;j<4;j++) {
			if(_t.board[j][i]!=0){
				for(var k=0;k<j;k++){
					// if((_t.board[k][i] == 0 || _t.board[j][i] == _t.board[k][i]) && _t.noBlockVertical(i,k,j)){
					// 	_t.showMoveAnimation(j,i,k,i);
					// 	_t.board[k][i] += _t.board[j][i];
					// 	_t.board[j][i] = 0;
					// }
					if(_t.board[k][i] == 0 && _t.noBlockVertical(i,k,j)){
                        //move
                        _t.showMoveAnimation(j,i,k,i);
                        _t.board[k][i] = _t.board[j][i];
                        _t.board[j][i] = 0;
                        continue;
                    }else if(_t.board[j][i] == _t.board[k][i] && _t.noBlockVertical(i,k,j) && !_t.hasConflicted[k][i] ){
                        //move
                        _t.showMoveAnimation(j,i,k,i);
                        //add
                        _t.board[k][i] += _t.board[j][i];
                        _t.board[j][i] = 0;
                        //add score
                        _t.scoreNum += _t.board[k][i];
                        _t.updateScore();

                        _t.hasConflicted[k][i] = true;
                        continue;
                    }

				}
			}
		}
	}
	setTimeout(function(){_t.updateBoardView()},_t.delayTime[2]);
	return true;
};
// 向下移动
Newgame.prototype.moveDown = function(){
	var _t = this;
	if(!_t.canMoveDown()) return false;
	for(i=0;i<4;i++){
		for (var j=2;j>=0;j--) {
			if(_t.board[j][i]!=0){
				for(var k=3;k>j;k--){
					// if((_t.board[k][i] == 0 || _t.board[j][i] == _t.board[k][i]) && _t.noBlockVertical(i,k,j)){
					// 	_t.showMoveAnimation(j,i,k,i);
					// 	_t.board[k][i] += _t.board[j][i];
					// 	_t.board[j][i] = 0;
					// }
					if( _t.board[k][i] == 0 && _t.noBlockVertical(i,j,k) ){
                        //move
                        _t.showMoveAnimation(j,i,k,i);
                        _t.board[k][i] += _t.board[j][i];
						_t.board[j][i] = 0;
                        continue;
                    }
                    else if( _t.board[j][i] == _t.board[k][i] && _t.noBlockVertical(i,j,k) && !_t.hasConflicted[k][i] ){
                        //move
                        _t.showMoveAnimation(j,i,k,i);
                        //add
                        _t.board[k][i] += _t.board[j][i];
						_t.board[j][i] = 0;
                        //add score
                        _t.scoreNum += _t.board[k][i];
                        _t.updateScore();

                        _t.hasConflicted[k][j] = true;
                        continue;
                    }
				}
			}
		}
	}
	setTimeout(function(){_t.updateBoardView()},_t.delayTime[2]);
	return true;
};
// 判断是否可以向左移动
Newgame.prototype.canMoveLeft = function(){
	for(i=0;i<4;i++){
		for (var j=1;j<4;j++) {
			if(this.board[i][j] !=0){
				if(this.board[i][j-1]==0||this.board[i][j-1]==this.board[i][j]){
					return true;
				}

			}
		}
	}
	return false;
};
Newgame.prototype.canMoveRight = function(){
	for(i=0;i<4;i++){
		for (var j=2;j>=0;j--) {
			if(this.board[i][j] !=0){
				if(this.board[i][j+1]==0||this.board[i][j]==this.board[i][j+1]){
					return true;
				}

			}
		}
	}
	return false;
};
Newgame.prototype.canMoveUp = function(){
	for(i=0;i<4;i++){
		for (var j=1;j<4;j++) {
			if(this.board[j][i] !=0){
				if(this.board[j-1][i]==0||this.board[j-1][i]==this.board[j][i]){
					return true;
				}

			}
		}
	}
	return false;
};
Newgame.prototype.canMoveDown = function(){
	for(i=0;i<4;i++){
		for (var j=0;j<3;j++) {
			if(this.board[j][i] !=0){
				if(this.board[j+1][i]==0||this.board[j][i]==this.board[j+1][i]){
					return true;
				}

			}
		}
	}
	return false;
};
// 判断水平行内的块间是否有障碍
Newgame.prototype.noBlockHorizontal = function(row,col1,col2){
	for(var i=col1+1;i<col2;i++){
		if(this.board[row][i]!=0)
			return false;
	}
	return true;
};
// 判断垂直的列的块间是否有障碍
Newgame.prototype.noBlockVertical = function(col,row1,row2){
	for(var i=row1+1;i<row2;i++){
		if(this.board[i][col]!=0)
			return false;
	}
	return true;
};
// 动画移动
Newgame.prototype.showMoveAnimation = function(fromX,fromY,toX,toY){
	var numCell = $("#num-cell-"+fromX+'-'+fromY);
	var _t = this;
	numCell.animate({
		top:this.setTop(toX,toY),
		left:this.setLeft(toX,toY)
	},_t.delayTime[1]);
};

// 支持触控
Newgame.prototype.touch = function(){
	var startX = startY = 0;
	var endX = endY = 0;
	var _t = this;
	document.addEventListener("touchstart",function(e){
		_t.delayTime = [0,30,40,50,60];
		startX = e.changedTouches[0]["pageX"];
		startY = e.changedTouches[0]["pageY"];
	});

	document.addEventListener("touchmove",function(e){
		e.preventDefault();
	});

	document.addEventListener("touchend",function(e){
		endX = e.changedTouches[0]["pageX"];
		endY = e.changedTouches[0]["pageY"];
		_t.judgeMove(startX,startY,endX,endY);
	});
};

Newgame.prototype.judgeMove = function(startX,startY,endX,endY){
	var _t = this;
	var documentWidth = window.screen.availWidth;
	var deltaX = startX-endX;
	var deltaY = startY - endY;

	if( Math.abs( deltaX ) < 0.1*documentWidth && Math.abs( deltaY ) < 0.1*documentWidth )
        return;

	if (Math.abs(deltaX)>Math.abs(deltaY)) {
		if(deltaX>0){
            if( this.moveLeft() ){
                setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
            }
		} else {
			if( this.moveRight() ){
                setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
            }
		}
	} else {
		if(deltaY>0){
			if(this.moveUp()){
                setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
			}
		} else {
			if (this.moveDown()) {
            	setTimeout(function(){_t.addNumCell();},_t.delayTime[3]);
            }
		}
	}
	setTimeout(function(){_t.isGameOver();},_t.delayTime[4]);
};