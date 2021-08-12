var dragging;
const TEXT = 'text/plain';

var idSeed = 0;

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
function createElementFromHTML(htmlString) {
    // https://www.codegrepper.com/code-examples/javascript/javascript+create+element+from+string
    var div = document.createElement('div');
    // Never return a text node of whitespace as the result
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
}
function cardFactory(id, name){
        var description = prompt("Enter Description", "");

  var contextMenu = document.getElementById('context-menu');
    //<div id="c1" draggable="true" class="card">Card 1 <button class="elipses">...</button></div>
    //let node =  document.createElement('div');
    let cards = document.querySelectorAll('.card');

    let card = createElementFromHTML( `<div id=${guid()} draggable="true" class="card" >
    <div class="description">${description || 'Card ' + (cards.length + 1)}</div>
    <button class="delete">X</button>

    <button class="elipses2"></button>
    <button class="chevrons"></button>
    
    </div>`);

    function hideShow(element){
        
        if(element.classList.contains('display-none')){
            element.classList.remove('display-none');
            element.classList.add('display-block');
            return true;
        } else if(element.classList.contains('display-block')){
            element.classList.remove('display-block');
            element.classList.add('display-none');
            return false;
        } 
    }

    
    contextMenu.addEventListener('blur', e=>{
        console.log(e);
        hideShow(contextMenu);
    }, false);
    contextMenu.addEventListener('click', e=>{
        console.log(e);
        hideShow(contextMenu);
    }, false);

    hideShow(contextMenu);
    let ellipsis = card.querySelector('.elipses2');
    ellipsis.addEventListener('click', e=>{
        console.log(e);
        let bbox = e.target.getBoundingClientRect();
        console.log(bbox);
        contextMenu.style.left = bbox.left + 'px';
        // contextMenu.style.top = (bbox.top + bbox.bottom - bbox.top) + 'px';
        contextMenu.style.top = bbox.top + 'px';
        hideShow(contextMenu);
    }, false);


    let button = card.querySelector('.chevrons');
    button.addEventListener('click', e=>{
        e.stopPropagation();
        // let target = e.target;
        // let bbox = target.getBoundingClientRect();
        // console.log(e.target.parentNode.id);
        // console.log(bbox);
        // console.log(e.target.parentNode.offsetHeight);
        // contextMenu.style.top = (bbox.top + bbox.height) + 'px';
        // contextMenu.style.left = (bbox.x) + 'px';
        // contextMenu.style.display = 'block';

        let parent = e.target.parentNode;
        while(parent !== undefined){
            if(parent.classList.contains('card')){
                break;
            }
        }
        if(parent.classList.contains('taller')){
            parent.classList.remove('taller');
            button.classList.remove('point-up');
        } else {
            parent.classList.add('taller');
            button.classList.add('point-up');
            
        }

    });

    let cancel = card.querySelector('.delete');
    cancel.addEventListener('click', e=>{
        let parent = e.target.parentNode;
        while(parent !== undefined){
            if(parent.classList.contains('dropzone')){
                break;
            }
            parent = parent.parentNode;
        }
        let card = e.target.parentNode;
        while(card !== undefined){
            if(card.classList.contains('card')){
                break;
            }
            card = card.parentNode;
        }
        parent.removeChild(card);
    });
    card.addEventListener('dragstart', e =>{
        e = DragStartEventHandler(e);

    }, false);
    card.addEventListener('dragend', e =>{
        e.target.classList.remove('drag-start');
    }, false);


    // card.ondblclick=function(){
    //     var val=this.innerText;
    //     var input=document.createElement("input");
    //     input.value=val;
    //     input.onblur=function(){
    //         var val=this.value;
    //         this.parentNode.innerText=val;
    //     }
    //     this.innerText="";
    //     this.appendChild(input);
    //     input.focus();
    // }


    return card;
}
function DragStartEventHandler(e) {
    cleanUpCards();
    e.target.classList.add('drag-start');
    //e.dataTransfer.setData(TEXT, e.target.id);
    // The data contents determine what happens when the element is dropped onto browser address bar, tab or other browser.
    e.dataTransfer.setData(TEXT, `http://www.innovacharts.com?guid=${e.target.id}`);
    dragging = e.target;
    let img = new Image();
    img.src = 'images/dragClear.jpg';
    return e;
}

function cleanUpCards(){
    return;
    for(let i = 0; i < cards.length; i++){
        let child = cards[i];
        child.classList.remove('push-down');
    } 
}
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function processAddCard() {
    let addCardButton = document.getElementById('addCard');
    addCardButton.addEventListener('click', e => {
        let card = cardFactory();
        document.getElementById('backlog').appendChild(card);
    }, false);
}
function isNullOrUndefined(node) {
    return node === undefined || node === null;
};
function processColumns() {
    var columns = document.querySelectorAll('.dropzone');

    for (let i = 0; i < columns.length; i++) {
        let column = columns[i];
        console.log(column);

        column.addEventListener('dragover', e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        }, false);

        column.addEventListener('dragenter', e => {
            if (e.target.classList.contains('dropzone')) {
                e.target.classList.add('drag-enter');
                cleanUpCards();
            }
        }, false);

        column.addEventListener('dragleave', e => {
            //drag-enter
            if (e.target.classList.contains('dropzone')) {
                e.target.classList.remove('drag-enter');
            }
        }, false);

        column.addEventListener('drop', e => {

            e.preventDefault();
            let target = e.target;
            // The target may not be a dropzone, so traverse up through parents to find a dropzone node.
            if (!e.target.classList.contains('dropzone')) {
                let parent = e.target.parentNode;
                while (parent !== undefined) {
                    console.log(parent);
                    if (parent.classList.contains('dropzone')) {
                        break;
                    }
                    parent = parent.parentNode;
                }
                if (parent !== undefined) {
                    //console.log(e.target);
                    target = parent;
                }
            }
            // The target should be a drop zone.
            if (target.classList.contains('dropzone')) {
                const data = e.dataTransfer.getData(TEXT);

                let children = target.children;
                let child = undefined;
                let last = 0;

                let parent = target;
                let parentTop = parent.offsetTop;
                let mids = [];
                let middle = undefined;
                let firstChild = children[0];
                if (children.length > 0) {
                    for (let i = 0; i < children.length; i++) {
                        child = children[i];
                        let y = e.clientY;
                        let bbox = child.getBoundingClientRect();
                        let top = bbox.top;
                        let height = bbox.bottom - top;
                        let mid = top + (height / 2);
                        if (y > mid) {
                            middle = child;
                        } else {
                            break;
                        }
                    }
                }
                let next = undefined;
                if (middle !== undefined) {
                    next = middle.nextSibling;
                    console.log(isNullOrUndefined(next));
                    if (!isNullOrUndefined(next)) {
                        if (middle.id !== dragging.id) {
                            //console.log(dragging, next);
                            if (next.id !== undefined) {
                                if (dragging.id === next.id) {
                                    console.log(5);
                                    target.classList.remove('drag-enter');
                                    e.stopPropagation();
                                    return false;
                                }
                            }
                            console.log(1);
                            dragging.parentNode.removeChild(dragging);
                            target.insertBefore(dragging, next);
                        } else {
                            console.log(4);
                            target.classList.remove('drag-enter');
                            e.stopPropagation();
                            return false;
                        }
                    } else {
                        //console.log(middle);
                        let y = e.clientY;
                        let bbox = middle.getBoundingClientRect();
                        let top = bbox.top;
                        let height = bbox.bottom - top;
                        let mid = top + (height / 2);
                        console.log(y, mid);
                        if (y > mid) {
                            console.log(3);
                            console.log(data);

                            dragging.parentNode.removeChild(dragging);
                            target.appendChild(dragging);
                        } else {
                            console.log(6);

                            dragging.parentNode.removeChild(dragging);
                            target.insertBefore(dragging, middle);
                        }

                    }
                } else {
                    if(dragging !== undefined){
                        dragging.parentNode.removeChild(dragging);
                        target.insertBefore(dragging, target.firstChild);     
                    }


                    console.log(2);
                }
                target.classList.remove('drag-enter');

            }

            dragging = undefined;
            e.stopPropagation();
            return false;
        }, false);

        column.addEventListener('dragend', e => {
            cleanUpCards();

        }, false);
    }
}
function processCards() {
    var cards = document.querySelectorAll('.card');

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        //console.log(card);
        //
        card.addEventListener('dragstart', e => {
            e = DragStartEventHandler(e);
        }, false);
        card.addEventListener('dragend', e => {
            e.target.classList.remove('drag-start');
        }, false);
    }
    return cards;
}
function processEllipses() {
    var elipses = document.querySelectorAll('.elipses');

    for (let i = 0; i < elipses.length; i++) {
        let elipse = elipses[i];
        elipse.addEventListener('click', e => {
            let parent = e.target.parentNode;
            while (parent !== undefined) {
                if (parent.classList.contains('card')) {
                    break;
                }
            }
            if (parent.classList.contains('taller')) {
                parent.classList.remove('taller');
            } else {
                parent.classList.add('taller');
            }
        });
    }
}
var editbox;
var context;
function main(){
    let c1 = cardDataFactory({ owner: 'John Berman', name: 'Test', description: 'New Card'})
        .addNote('Test note')
        .addNote('Second note. A bit more content.');

    let ready = document.querySelectorAll('.dropzone');
    console.log(ready[0]);
    dataStore().forEach(data => {
        let c = new card(data);
        console.log(c.toHtml());

        
        ready[c.column].appendChild(createElementFromHTML(c.toHtml()));
    });
    processAddCard();

    //processEllipses();

    processCards();

    processColumns(); 
    editbox = document.getElementById('editNoteInput');
    editbox.addEventListener('blur', e=>{
        const nid = e.target.getAttribute("data-subjet");
        console.log(nid);
        const note = document.getElementById(nid);
        note.innerText = e.target.value;
        note.style.height = null;
        console.log(e.target);
        e.target.style.visibility = 'hidden';

    });
    context = document.getElementById('context');

    document.addEventListener("drop", function( e ) {
        console.log('stop');
        console.log(e.x,e.y);
        let x = e.x;
        let y = e.y;
        if(y <= 0 || x  <= 0){
            
        }
    }, false);


    // document.addEventListener('drop', e => {
    //     console.log(e.x, e.y);
    //     if(e.x <= 0 || e.y <= 0){
    //         e.preventDefault();
    //         e.stopPropagation();
    //         return false;
    //     }
    // },false);
}
