let myLeads = []
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")
const deleteBtn = document.getElementById("delete-btn")
const leadsFromLocalStorage = JSON.parse( localStorage.getItem("myLeads") )
const tabBtn = document.getElementById("tab-btn")

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    })
})

function render(urls) {
    let listItems = ""
    for (let i = 0; i < urls.length; i++) {
        listItems += `
            <li id='li-el'>
                <a target='_blank' href='${urls[i]}'>
                    ${urls[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
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
            inputEl.placeholder = "Hint: Click to save, Double click to open site"
        }
        function respondMouseOut() {
            aEl[i].style.cssText = "color:#4fc6e4;"
            inputEl.placeholder = "https://"
        }
    }
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear()
    myLeads = []
    render(myLeads)
    ulEl.innerHTML = ""
})

inputBtn.addEventListener("click", function() {
    if(inputEl.value == ""){
        void(0)
    }else{
        myLeads.push(inputEl.value)
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
        inputEl.value = "";
    }
})
