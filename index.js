import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,ref,push,onValue,remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

const firebaseConfig = {
    databaseURL: "https://saveurls-8caba-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDb = ref(database,"SavedUrls")

// console.log(app)
// console.log(database)

let savedUrls = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")

onValue(referenceInDb,function (snapshot){
    if(snapshot.exists()){
        savedUrls = Object.values(snapshot.val())
        render(savedUrls)
    }
})


function render(urls) {
    let listItems = ""
    for (let i = 0; i < urls.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='https://${urls[i]}'>
                    ${urls[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
    ulEl.style.cssText = "border: 1px solid lightcoral; box-shadow: 2px 6px 6px rgba(240, 128, 128, 0.3),2px 6px 30px rgba(240, 128, 128, 0.3) inset;"
}

deleteBtn.addEventListener("dblclick", function(){
    remove(referenceInDb)
    ulEl.innerHTML= ""
    ulEl.style.cssText = ""
})

inputBtn.addEventListener("click", function() {
    if(inputEl.value==""){
        inputEl.value = ""
    }else{
    push(referenceInDb,inputEl.value)
    inputEl.value = ""}
})