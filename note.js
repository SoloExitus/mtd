class Note{
    static dragged = null;

    constructor(content=""){

        const Element=this.Element=document.createElement('div');

        Element.classList.add('note');
        Element.setAttribute('draggable','true');
        Element.textContent=content;

        Element.addEventListener('dblclick',function(event){
            Element.setAttribute('contenteditable','true');
            Element.removeAttribute('draggable');
            Element.closest('.column').removeAttribute('draggable');
            Element.focus();
        });

        Element.addEventListener('blur',function(event){
            Element.removeAttribute('contenteditable');
    
            Element.setAttribute('draggable','true');
            Element.closest('.column').setAttribute('draggable','true');
    
            const Column=Element.closest('.column');

            if (!Element.textContent.trim().length){
                Element.remove();
            }
            UpDateColumn(Column);
        });
    
        Element.addEventListener('dragstart',this.dragstart.bind(this));
        Element.addEventListener('dragend',this.dragend.bind(this));
        Element.addEventListener('dragenter',this.dragenter.bind(this));
        Element.addEventListener('dragover',this.dragover.bind(this));
        Element.addEventListener('dragleave',this.dragleave.bind(this));
        Element.addEventListener('drop',this.drop.bind(this));

    }

    dragstart(event){
        Note.dragged=this.Element;
        this.Element.classList.add('dragged');

        event.stopPropagation();
    }

    dragend(event){
        Note.dragged=null;
        this.Element.classList.remove('dragged');
        document.querySelectorAll('.note').forEach(x=>x.classList.remove('under'));
        event.stopPropagation();
    }

    dragenter(event){
       event.stopPropagation();
       if ( !Note.dragged || this.Element === Note.dragged) {
           return
        }
        this.Element.classList.add('under');
    }

    dragover(event){
        event.preventDefault();
        
        if ( !Note.dragged || this.Element === Note.dragged) {
            return
        }
    }

    dragleave(event){
        event.stopPropagation();
        if ( !Note.dragged || this.Element === Note.dragged) {
            return
       }
       this.Element.classList.remove('under');
    }

    drop(event){
        event.stopPropagation();
        if ( !Note.dragged || this.Element === Note.dragged) {
            return
        }
    
        if (this.Element.parentElement === Note.dragged.parentElement){
            const note= Array.from(this.Element.parentElement.querySelectorAll('.note'));
            const indexA= note.indexOf(this.Element);
            const indexB= note.indexOf(Note.dragged);
    
            if (indexA < indexB){
                this.Element.parentElement.insertBefore(Note.dragged,this.Element);
            }else{
                this.Element.parentElement.insertBefore(Note.dragged, this.Element.nextElementSibling);
            }
            UpDateColumn(this.Element.closest('.column'));
        }else{
            const parent=this.Element.closest('.column');
            this.Element.parentElement.insertBefore(Note.dragged,this.Element);
            UpDateColumn(Note.dragged.closest('.column'));
            UpDateColumn(parent);
        }
    }
}