let db;
let dbReq = indexedDB.open('MYTODO', 1);

dbReq.onupgradeneeded = (event) => {
  // Зададим переменной db ссылку на базу данных
  db = event.target.result;
  // Создадим хранилище объектов с именем notes.
  let notes = db.createObjectStore('Columns', {Keypath:"order"});
}

dbReq.onsuccess = (event) => {
  db = event.target.result;
  LoadStore(db);
}

dbReq.onerror = (event) => {
  alert('error opening database ' + event.target.errorCode);
}

function ChangeOrderColumn(index){
  const children = Array.from(document.querySelector('.columns').children);
  const last=children.length;

  let tx = db.transaction(['Columns'], 'readwrite');
  let store = tx.objectStore('Columns');

  for(let i=index-1;i<last;i++){
    children[i].setAttribute('order',i+1);
    store.put(PackUp(children[i]),i);
  }

  tx.oncomplete = () => {
    console.log('Order changing sucsessful !');
  }
  tx.onerror = (event) => {
    alert('Error changing Order ' + event.target.errorCode);
  }
}

function DeletColumn(indexDelet){
  const index=indexDelet-1;
  const children = Array.from(document.querySelector('.columns').children);
  const last=children.length;
  console.log(children.length);
  let tx = db.transaction(['Columns'], 'readwrite');
  let store = tx.objectStore('Columns');

  for(let i=index;i<last;i++){
    children[i].setAttribute('order',i+1);
    store.put(PackUp(children[i]),i);
  }

  store.delete(last);

  tx.oncomplete = () => {
    console.log('Column deleting sucsessful !');
  }
  tx.onerror = (event) => {
    alert('Error Deleting Column ' + event.target.errorCode);
  }
}

function PackUp(column){
  const pack={
    title:column.querySelector('.column-title').textContent,
    notes:[],
  }
  column.querySelectorAll('.note').forEach(elem=>{
    pack.notes.push(elem.textContent);
  })
  return pack;
}
 
function UpDateColumn(column){

  const index=column.getAttribute('order');

  let tx = db.transaction(['Columns'], 'readwrite');
  let store = tx.objectStore('Columns');

  let req=store.put(PackUp(column),index-1);

  req.onsuccess = (event) => {
    console.log("Column UpDating sucessful !");
  }
 
  req.onerror = (event) => {
    alert('Error UpDating Column ' + event.target.errorCode);
  }

}


const DisplayColumn=(ce)=>{
  const NewElement =new Column(ce.notes,ce.title);
  document.querySelector('.columns').append(NewElement.Element);
}

const LoadStore = (db) => {
  // Запустим транзакцию базы данных и получите хранилище объектов Notes
  let tx = db.transaction(['Columns'], 'readonly');
  let store = tx.objectStore('Columns');
  //создаем курсор
  let req = store.openCursor();

  req.onsuccess = (event) => {
    // Результатом req.onsuccess в запросах openCursor является
     // IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {
      // Если курсор не нулевой, мы получили элемент.
      DisplayColumn(cursor.value);
      cursor.continue();
    }
  }

  // Ожидаем завершения транзакции базы данных
  tx.oncomplete = () => {
    console.log('stored column!')
  }
  tx.onerror = (event) => {
    alert('error storing column ' + event.target.errorCode);
  }
}