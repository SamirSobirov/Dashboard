let addTask = document.querySelector('.right button')
let closeBtn = document.querySelector('.close_area')
let popup = document.querySelector('.popup')
let B_url = 'http://localhost:8090/users'
let tasks_list = document.querySelector('.tasks_list')
let form = document.forms.popup_form
let table_view = document.querySelector('.show_type .table_type')
let tile_view = document.querySelector('.show_type .tile_type')
let tasks = document.querySelector('.tasks')
let inps = form.querySelectorAll('input')
let delete_btn = form.querySelector('.delete')
let obj = {}

addTask.onclick = () => modalToggle()
closeBtn.onclick = () => modalToggle()

form.onsubmit = (e) => {
    e.preventDefault()
    let count = 0
    let fm = new FormData(form)
    fm.forEach((v, k) => {
        if (v === '') {
            count = 0
        } else {
            obj[k] = v
            count++
        }
    })
    if (count < 4) {
        inps.forEach(el => el.value === '' ? el.style.borderColor = 'red' : el.style.borderColor = 'black')
        return
    }
    if (delete_btn.classList.contains('unVisible')) {
        fetch(B_url, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" }
        }).then(() => reFetch())
        modalToggle()
        form.reset()
    } else {
        fetch(`${B_url}/${obj.id}`, {
            method: "PATCH",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" }
        }).then(() => reFetch())
        modalToggle()
        form.reset()
    }
}

function reload(arr, place) {
    place.innerHTML = ''
    for (let item of arr) {
        let task = document.createElement('div')
        let title = document.createElement('h3')
        let descr = document.createElement('p')
        let date_time = document.createElement('div')
        let date = document.createElement('div')
        let time = document.createElement('div')
        let state = document.createElement('div')

        task.classList.add('task')
        title.classList.add('title')
        descr.classList.add('descr')
        date_time.classList.add('date_time')
        date.classList.add('date')
        time.classList.add('time')
        state.classList.add('state')

        title.innerHTML = item.title
        descr.innerHTML = item.descr
        date.innerHTML = item.date.slice(2).replaceAll('-', '.')
        time.innerHTML = item.time
        state.innerHTML = item.state
        if (item.state === 'new') {
            state.style.color = '#FF3F3F'
        } else if (item.state === 'progress') {
            state.style.color = '#007FFF'
        } else {
            state.style.color = '#000000'
        }

        place.append(task)
        task.append(title, descr, date_time, state)
        date_time.append(date, time)

        task.onclick = () => {
            delete_btn.classList.remove('unVisible')
            form.elements.date.value = item.date
            form.elements.time.value = item.time
            form.elements.title.value = item.title
            form.elements.descr.value = item.descr
            obj.id = item.id
            modalToggle()

            delete_btn.onclick = () => {
                modalToggle()
                fetch(`${B_url}/${item.id}`, {
                    method: "DELETE"
                }).then(() => reFetch())
            }
        }
    }
}
reFetch()

function modalToggle() {
    if (popup.classList.contains('popup_act')) {
        popup.classList.remove('popup_act')
        delete_btn.classList.add('unVisible')
        form.reset()
        inps.forEach(el => el.style.borderColor = 'black')
    } else { popup.classList.add('popup_act') }
}
function reFetch() { fetch(B_url).then(res => res.json()).then(res => reload(res, tasks_list)) }