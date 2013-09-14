var canvas, stage;
var drawingCanvas;
var oldPt;
var oldMidPt;
var title;
var color;
var stroke;
var colors;
var index;

function toggleWriteAndDraw() {
	var $canvas = this.$('.entry canvas');
	var $textarea = this.$('.entry textarea');
	var $toolbar = this.$('#handwritingToolbar');
	var $toggleIconDraw = $('#handwritingIconDraw');
	var $toggleIconType = $('#handwritingIconType');

	if ($textarea.css('display') == 'none') {
		$textarea.show();
		$toggleIconDraw.show();
		$toggleIconType.hide();
		$canvas.hide();
		$toolbar.hide();
	} else {
		$canvas.show();
		$toolbar.show();
		$toggleIconType.show();
		$toggleIconDraw.hide();
		$textarea.hide();
	}

	if (stage == undefined) {
		canvas_init();
	}
}

function getStageImageData() {
	if (stage != null) {
		return stage.toDataURL();
	} else {
		return '';
	}
}

function clearStageCanvas() {
	if (stage != null) {
		return stage.clear();
	}
}

function canvas_init() {
	canvas = document.getElementById("myCanvas");
	index = 0;

	//initialize color selector
	$("#brushColor").spectrum({
		clickoutFiresChange: true,
		showButtons: false,
		showPalette: true
	});

	//check to see if we are running in a browser with touch support
	stage = new createjs.Stage(canvas);
	stage.autoClear = false;
	stage.enableDOMEvents(true);

	createjs.Touch.enable(stage);
	createjs.Ticker.setFPS(24);

	drawingCanvas = new createjs.Shape();

	stage.addEventListener("stagemousedown", handleMouseDown);
	stage.addEventListener("stagemouseup", handleMouseUp);

	title = new createjs.Text("Click and Drag to draw", "12px Arial", "#777777");
	title.x = 75;
	title.y = 150;
	stage.addChild(title);

	stage.addChild(drawingCanvas);
	stage.update();
}

function stop() {}

function handleMouseDown(event) {
	if (stage.contains(title)) { stage.clear(); stage.removeChild(title); }
	color = $("#brushColor").spectrum("get").toHexString();
	stroke = parseInt($('#brushSize').val());
	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
	oldMidPt = oldPt;
	stage.addEventListener("stagemousemove" , handleMouseMove);
}

function handleMouseMove(event) {
	var midPt = new createjs.Point(oldPt.x + stage.mouseX>>1, oldPt.y+stage.mouseY>>1);

	drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	oldPt.x = stage.mouseX;
	oldPt.y = stage.mouseY;

	oldMidPt.x = midPt.x;
	oldMidPt.y = midPt.y;

	stage.update();
}

function handleMouseUp(event) {
	stage.removeEventListener("stagemousemove" , handleMouseMove);
}