var pageCount = 1;
var pageNumber = 0;
var moving = false;
var backflip = false;
var lastMode = 0;
var translation = 0;
var rotation = 0;
var curPage;
var newPage;
var pages = [];

initPages();

window.requestAnimationFrame(runLoop);

function update(){
    if(moving)
	moveCurPage();
}
function draw(){
    if(moving)
	drawCurPageTransition();
}
function runLoop(){
    update();
    draw();
    window.requestAnimationFrame(runLoop);
}

function centerBook(){
       // Only center the first page if it's the current page
    if (curPage === pages[0]) {
        curPage.style.position = 'absolute';
        curPage.style.left = '50%';
        curPage.style.transform = 'translateX(-50%)';
    }
}

function initPages(){
    let firstElement = document.getElementById("page0");
    pages.push(firstElement);
    curPage = firstElement;
    centerBook();
}
function nextPage(){
    if(moving) return;
    pageNumber++;
    if(lastMode == 2)
	pageNumber++;
    if(pageCount > 1 && lastMode == 1)
	curPage = newPage;
    startPageMoving();
    createPage();
    centerBook();
    if(pageCount < 3)
	pageCount++;
    lastMode = 1;
}
function prevPage(){
    if(pageNumber <= 1){
	centerPage();
	return;
    }
    if(moving) return;
    pageNumber--;
    if(lastMode == 1)
	pageNumber--;
    if(lastMode == 2)
	curPage = newPage;
    startPageMoving();
    backflip = true;
    rotation = -180;
    createPage();
    if(pageCount < 3)
	pageCount++;
    lastMode = 2;
}
function startPageMoving(){
    moving = true;
    curPage.style.position = "absolute";
    curPage.style.width = "100%";
    curPage.childNodes[0].style.width = "50%";
    curPage.style.justifyContent = "end";
    curPage.style.zIndex = "5";
}

function moveCurPage(){
    if(backflip){
	translation += 2.0833333333333;
	rotation += 3.75;
    } else {
	translation -= 2.0833333333333;
	rotation -= 3.75;
    }
    if(translation <= -100 || translation >= 100)
	stopMoving();
}

function stopMoving(){
    moving = false;
    curPage.style.width = "50%";
    curPage.childNodes[0].style.width = "100%";
    curPage.style.justifyContent = "center";
    if(backflip){
	curPage.style.transform = "translateX(100%) rotateY(0deg)";
    } else {
	curPage.style.transform = "translateX(-100%) rotateY(-180deg)";
    }
    if(pageCount >= 3)
	removePage();
    if(backflip) backflip = false;
    translation = 0;
    rotation = 0;
    
}
function drawCurPageTransition(){
    if(curPage == pages[0]){
	curPage.style.transform = "translate(-50%) rotateY("+rotation+"deg)";
	return;
    }
    curPage.style.transform = "rotateY("+rotation+"deg)";
}
function createPage(){
    const book = document.getElementById("book");
    if(backflip)
	book.style.justifyContent = "start";
    else
	book.style.justifyContent = "end";
    page = document.createElement("div");
    page.setAttribute("id", "page"+pageNumber);
    page.setAttribute("class", "page");

    pageImage = document.createElement("img");
    pageImage.setAttribute("class", "pageImg");
    pageImage.setAttribute("src", getPageImage());
    page.appendChild(pageImage);

    book.appendChild(page);
    newPage = page;
    if(backflip){
	pages.unshift(page);
	return;
    }
    pages.push(page);
}
function removePage(){
    if(backflip)
	popPage();
    else
	shiftPage();
}
function shiftPage(){
    let shifted = pages.shift();
    const book = document.getElementById("book");
    book.removeChild(shifted);
    console.log("shifted");
    pageCount--;
}
function popPage(){
    let popped = pages.pop();
    const book = document.getElementById("book");
    book.removeChild(popped);
    console.log("popped");
    pageCount--;
}
function getPageImage(){
    return "assets/testPage.png";
}
