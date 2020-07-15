const $todoForm = document.forms["todo_form"];
const $taskInp = document.forms["todo_form"].task_inp;
const $submitBtn = document.forms["todo_form"].submit_btn;
const $todoList = document.querySelector('.todo-list');

const empty = (elm) => elm.innerHTML = "";

let TodoDB = Stack();
renderData( TodoDB.getData() )

function Stack () {
    const key = 'todos_db';
    let data = [];
    let count = 0;

    push = (item) => {
        data[count++] = item;
        setData()
    };

    pop = () => {
        if (count === 0) return undefined;
        const delItem = data[count - 1];
        delete data[--count];
        // data[--count] = null;
        // setData()
        return delItem;
    };

    swap = (_i,_l) => {
        const i = _i, l = _l;
        [arr[i], arr[l]] = [arr[l], arr[i]];
    }

    print = () => {
        let num = count - 1;
        while ( num >= 0) {
            console.log(num,data[num])
            num--;
        }
    };

    size = () => count;
    
    peek = () => data[count - 1];

    isEmpty = () => (count === 0) ? true : false;

    serial = () => (count) ? data[count - 1].id + 1 : 0;

    getData = () => {
        if (data.length) return data;
        const getDB = localStorage.getItem(key);
        data = JSON.parse(getDB) || [];
        count = (data.length) ? data.length : 0;
        console.log(data)
        return data;
    };

    setData = () => {
        const setDB = JSON.stringify(data);
        localStorage.setItem(key,setDB)
    };

    updateData = (id, val) => {
        if (typeof val === 'string') data[id].item = val;
        if (typeof val === 'boolean') data[id].completed = !val;
        setData()
    };

    removeData = (id) => {
        delete data[id];
        data = data.filter(Boolean);
        count--;
        setData()
    };

    removeDB = () => {
        localStorage.removeItem(key)
    };

    return {
        push,
        pop,
        swap,
        print,
        size,
        peek,
        isEmpty,
        serial,
        getData,
        setData,
        updateData,
        removeData,
        removeDB
    };
}

function appendDOM (elm,idx) {
    const checked = (elm.completed) ? 'task-completed' : '';
    const completed = (elm.completed) ? 'checked' : '';
    
    $todoList.insertAdjacentHTML(
        'beforeend',
        `
        <div class="task-card" data-id="${ idx }">
            <div class="task-check">
                <input 
                    type="checkbox" 
                    name="check" 
                    id="${ 'check-box-'+idx }"
                    class="check-box"
                    ${ completed }
                />
                <label 
                    for="${ 'check-box-'+idx }" 
                    class="check-mark"
                ></label>
            </div>
            <p class="task-title ${checked}" contenteditable>
                <span>${ elm.item }</span>
            </p>
            <div class="task-opts">
                <button class="edit-btn">✎</button>
                <button class="delete-btn">×</button>
            </div>
        </div>
        `
    )
}

function renderData (data) {
    // console.log(data)
    if (data instanceof Array) {
        console.log('Array:',data)
        empty($todoList)
        data.map(appendDOM)
        return;
    }
    if (data instanceof Object) {
        console.log('Object:',data)
        appendDOM(data,(TodoDB.size() - 1))
        return;
    }
}

$todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    $taskInp.value.trim()
    const task = $taskInp.value.trim();
    if (task === "") return;
    
    const data = {
        id: TodoDB.serial(),
        item: task,
        completed: false
    }

    console.log(data)
    TodoDB.push(data)
    $todoForm.reset()
    renderData(data)
})

function completeTask (e) {
    const card = e.target.parentElement.parentElement;
    const isChecked = e.target.previousElementSibling.checked;
    const id = card.dataset.id;
    // console.log(card,id,isChecked)
    TodoDB.updateData(id,isChecked)
    const text = card.querySelector('.task-title');
    text.classList.toggle('task-completed')
}
function editTask (e) {
    const card = e.target.parentElement.parentElement;
    const text = card.querySelector('.task-title').textContent.trim();
    const id = card.dataset.id;
    // console.log(card,id,text)
    TodoDB.updateData(id,text)
}
function deleteTask (e) {
    const card = e.target.parentElement.parentElement;
    const id = card.dataset.id;
    // console.log(card,id)
    TodoDB.removeData(id)
    card.parentElement.removeChild(card)
}

$todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('check-mark')) {
        // console.dir(e.target)
        completeTask(e)
        return;
    }
    if (e.target.classList.contains('edit-btn')) {
        // console.dir(e.target)
        editTask(e)
        return;
    }
    if (e.target.classList.contains('delete-btn')) {
        // console.dir(e.target)
        deleteTask(e)
        return;
    }
})