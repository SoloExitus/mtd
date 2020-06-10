class Column{
    static dragged=null;

    static dropped=null;

    static OrderCounter=1;

    constructor(Notes=null,ColumnTitle="В плане"){
        const Element =this.Element= document.createElement('div');
        Element.classList.add('column');
        Element.setAttribute('draggable','true');
        Element.setAttribute('order',Column.OrderCounter);
        Column.OrderCounter++;

        Element.innerHTML=
            `<div class="column-header">
            <p class="column-title">${ColumnTitle}</p>
            <img class="column-delet" src="./trash.png" alt="delet-column">
            </div>
            <div data-notes>
            </div>
            <p class="column-footer">
                <span data-action-addNote class="action">+ Добавить карточку</span>
            </p>`
    
        if (Notes){
            for(const NoteText of Notes){
                const NewNote=new Note(NoteText);
                Element.querySelector('[data-notes]').append(NewNote.Element);
            }
        }

        Element.querySelector('[data-action-addNote]').addEventListener('click',function(event){

            const NewNote = new Note();
        
            Element.querySelector('[data-notes]').append(NewNote.Element);
            NewNote.Element.setAttribute('contenteditable','true');
            NewNote.Element.focus();
        })

        Element.querySelector('.column-delet').addEventListener('click',function(event){
            const indexDelet=Element.getAttribute('order');
            Element.remove();
            DeletColumn(indexDelet);
        })

        Element.addEventListener('dragstart',this.dragstart.bind(this));
        Element.addEventListener('dragend',this.dragend.bind(this));
        Element.addEventListener('dragover',this.dragover.bind(this));
        Element.addEventListener('drop', this.drop.bind(this));

        const Header = Element.querySelector('.column-title');

        Header.addEventListener('dblclick',function(event){
            Header.parentNode.removeAttribute('draggable');
            Header.setAttribute('contenteditable','true');
            Header.focus();
        })

        Header.addEventListener('blur',function(event){
            if (!Header.textContent.trim().length){
                Header.textContent=`Заголовок столбца`;
            }
            Header.removeAttribute('contenteditable',true);
            Header.parentNode.setAttribute('draggable',true);
        
            UpDateColumn(Header.closest('.column'));
        })

        Header.addEventListener('blur',function(event){
            if (!Header.textContent.trim().length){
                Header.textContent=`Заголовок столбца`;
            }
            Header.removeAttribute('contenteditable',true);
            Header.parentNode.setAttribute('draggable',true);
        
            UpDateColumn(Header.closest('.column'));
        })

    }

    dragstart(event){
        Column.dragged=this.Element;
        Column.dragged.classList.add('dragged');
        event.stopPropagation();
        document.querySelectorAll('.note').forEach(NoteElement => NoteElement.removeAttribute('draggable'));
    }

    dragend(event){
        Column.dragged.classList.remove('dragged');
        Column.dragged=null;
        Column.dropped=null;

        document.querySelectorAll('.note').forEach(NoteElement => NoteElement.setAttribute('draggable', true));

        document.querySelectorAll('.column').forEach(ColumnElement => ColumnElement.classList.remove('under'));
    }

    dragover(event){
        event.preventDefault();
        event.stopPropagation();

        if (Column.dragged===this.Element){
            if (Column.dropped){
                Column.dropped.classList.remove('under');
            }
            Column.dropped=null;
        }

        if ( !Column.dragged || Column.dragged===this.Element){
            return
        }

        Column.dropped=this.Element;

        document.querySelectorAll('.column').forEach(ColumnElement => ColumnElement.classList.remove('under'));
        
        this.Element.classList.add('under');
        
    }


    drop (){
        if (Note.dragged){
            const DraggedParent=Note.dragged.closest('.column');
            this.Element.querySelector('[data-notes]').append(Note.dragged);
            UpDateColumn(this.Element);
            UpDateColumn(DraggedParent);
            return;
        }
        else if (Column.dragged) {
            const indexA = this.Element.getAttribute('order');
            const indexB = Column.dragged.getAttribute('order');
            if (indexA < indexB) {
                document.querySelector('.columns').insertBefore(Column.dragged, this.Element);
                ChangeOrderColumn(indexA);
            }
            
            else {
                document.querySelector('.columns').insertBefore(Column.dragged, this.Element.nextElementSibling);
                ChangeOrderColumn(indexB);
            }

            document
                .querySelectorAll('.column')
                .forEach(ColumnElement => ColumnElement.classList.remove('under'));
  
        }
    }


}


document.querySelector('[data-action-addcolumn]').addEventListener('click',function(event){
    const NewColumn =new Column();
    document.querySelector('.columns').append(NewColumn.Element);
    UpDateColumn(NewColumn.Element);
});