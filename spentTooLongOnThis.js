import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,ref,push,onValue,remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"


const firebaseConfig = {
    databaseURL: "https://saveurls-8caba-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const referenceInDb = ref(database,"SavedUrls")
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const infoEl = document.getElementById("info-el")
let savedUrls = []
let ulStyleContent = "border: 1px solid lightcoral; " +
    "box-shadow: 2px 6px 6px rgba(240, 128, 128, 0.3),2px 6px 30px rgba(240, 128, 128, 0.3) inset;" +
    "backdrop-filter: blur(1px);"
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
            <li id='li-el'>
                <a target='_blank' href='https://${urls[i]}'>
                    ${urls[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
    ulEl.style.cssText = ulStyleContent
    let liEl = document.getElementsByTagName("li")
    let aEl = document.getElementsByTagName("a")
    for (let i = 0; i < liEl.length; i++) {
        let clickCount = 0
        liEl[i].addEventListener("dblclick", function () {
            aEl[i].click()
            liEl.style.cssText = "color:#4fc6e4"
        })

        liEl[i].addEventListener("mouseover", respondMouseOver)
        liEl[i].addEventListener("mouseout", respondMouseOut)

        liEl[i].addEventListener( "click", function () {
            clickCount++;
            liEl[i].removeEventListener("mouseover", respondMouseOver)
            liEl[i].removeEventListener("mouseout", respondMouseOut)
            if (clickCount === 1) {
                    aEl[i].style.cssText = "color:lightgreen;"
                } else if(clickCount > 1) {
                    clickCount = 0;
                    liEl[i].addEventListener("mouseover", respondMouseOver)
                    liEl[i].addEventListener("mouseout", respondMouseOut)
                }
            })

            aEl[i].addEventListener("click", function () {
                liEl[i].style.cssText = "color:#4fc6e4;"
            })

            function respondMouseOver() {
                aEl[i].style.cssText = "color:lightgreen;"
                infoEl.style.cssText = "opacity:1"
                infoEl.innerText = "Hint: Click to save, Double click to open site"
            }
            function respondMouseOut() {
                aEl[i].style.cssText = "color:#4fc6e4;"
                infoEl.style.cssText = "opacity:0"
            }
    }
}

deleteBtn.addEventListener("dblclick", function(){
    remove(referenceInDb)
    ulEl.innerHTML= ""
    ulEl.style.cssText = ""
})

inputBtn.addEventListener("click", function() {
    if(inputEl.value==""){
        inputEl.value = ""
    } else {
        push(referenceInDb, inputEl.value)
        inputEl.value = ""
    }
})