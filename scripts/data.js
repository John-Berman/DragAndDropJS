
function noteFactory(note){
    this.note = note;
    this.added = new Date()
}

function cardDataFactory(config = {}){
    console.log('cardFactory');
    return new card(config);
}

function bigger(e){
    e.stopPropagation();
    console.log(e);
    let parent = e.target.parentNode;
    while(parent !== undefined){
        if(parent.classList.contains('card')){
            break;
        }
    }
    if(parent.classList.contains('taller')){
        parent.classList.remove('taller');
        e.target.classList.remove('point-up');
    } else {
        parent.classList.add('taller');
        e.target.classList.add('point-up');
        
    }

};
function editNote(e){
    const bbox = e.target.getBoundingClientRect();
    console.log(bbox);
    //console.log(e.target.innerText);
    console.log(e);
    console.log(window.scrollY, e.screenY);

    
    let text =  e.target.innerText;
    let height = bbox.height;
    e.target.innerText = '';
    editbox.value = text;
    // Because we are removing the text from the target, we need to set it's height
    // so it doesn't collapse and casue the elements below to move up.
    // The target height will need to be restored on editbox blur event.
    e.target.style.height = height +'px';
    editbox.setAttribute("data-subjet", e.target.id);
    // Add scrollY to ensure edit box is positioned correctly.
    editbox.style.top = (bbox.top + window.scrollY) + 'px';
    editbox.style.left = (bbox.left + window.scrollX) + 'px';
    editbox.style.height = height + 'px';
    editbox.style.width = (bbox.width) + 'px';
    editbox.style.visibility = 'visible';
    editbox.focus();

}

function contextMenu(e){
    const bbox = e.target.getBoundingClientRect();
    console.log(bbox);
    //console.log(e.target.innerText);
    console.log(e);
    console.log(window.scrollY, e.screenY);
    context.style.top = (bbox.top + window.scrollY + bbox.height) + 'px';
    context.style.left = (bbox.left + window.scrollX) + 'px';
    //context.style.height = height + 'px';
    //context.style.width = (bbox.width) + 'px';

}

function card(config = {}){
    this.id = config.id || guid();
    this.name = config.name || '';
    this.description = config.description || '';
    this.column = config.column || 0;
    this.owner = config.owner || '';
    this.notes = config.notes || [];
    this.ceated = config.created || new Date();
    this.cr = undefined,
    this.addNote = function(note){
        this.notes.push(new noteFactory(note));
        return this;
    }
    this.toHtml = function(){
        let notes = '';
        this.notes.forEach(note => {
            notes +=`<div class="note">
                        <div><input type="checkbox" name="${note.id}"  value="1"></div>
                        <div class="note-text" id="${note.id || guid()}" ondblclick="editNote(event)">${note.note}</div>
                    </div>`;
        });

        return `<div id=${this.id} draggable="true" class="card" >
                <div id="${this.description.id || guid()}" ondblclick="editNote(event)" class="description">${this.description}</div>
                <div class="notes">${notes}</div>
                <button onclick="contextMenu(event)" class="elipses2"></button>
                <button onclick="bigger(event)" class="chevrons"></button>
                </div>`;
    }
    return this;
}

function dataStore(){
    return [
         { 
            description: 'Work on web site for Drag and Drop API',
            column: 3,
            completed: (e=> {
                let d = new Date();
                d.setFullYear(2021);
                d.setDate(22);
                return d;
            })(),
            column: 3            
        },

        {
            description: 'Develop data structure for kanban cards.',
            column: 2,
            notes: [
                { note: 'Research best practice.', id: guid() }
            ]
        },
      
     
      
        {
            description: 'Create images for kanban board.',
            column: 1,
            notes: [
                { note: 'Use Inkscape.', id: guid()},
                { note: 'Keep them simple.', id: guid()}
            ]
        }
    ];

}