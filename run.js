language = "armenian"
lesson = 1
exercise = 1
questiontype = ""

function preformat(la, le){
    language = la
    lesson = le
    exercise = 1
    document.getElementById("menu").style.display = "none"
    document.getElementById("root").style.display = "block"
    format(languageData[language].plan[lesson-1][exercise-1])
}

function unformat(){
    document.getElementById("root").style.display = "none"
    document.getElementById("menu").style.display = "block"
}

function format(data){
    questiontypes = {
        "i": ["sentence", "words", "continue"], //info
        "l": ["sentence", "letter", "letterinfo", "continue"], //letter
        "d": ["sentence", "letter", "input", "keyboard", "enterbutton"], //definition
        "t": ["sentence", "letter", "input", "keyboard", "enterbutton"], //translit
        "c": ["sentence", "letter", "multiplechoice"], //capital
    }
    questiontype = data.split(":")[0]
    otherdata = data.split(":")[1]
    typelist = ["sentence", "letter", "letterinfo", "multiplechoice", "enterbutton", "continue", "input", "keyboard", "words"]
    for(var t of typelist) document.getElementById(t).style.display = questiontypes[questiontype].includes(t) ? "" : "none"
    switch(questiontype){
        case "c":
            target = otherdata.split(">")[0]
            answers = otherdata.split(">")[1].split("")
            document.getElementById("sentence").textContent = `Find the ${target.toUpperCase() != target ? "uppercase" : "lowercase"} version of this letter:`
            document.getElementById("letter").textContent = target
            for(g of [0,1,2]) document.getElementById("b" + (g+1)).textContent = answers[g]
            break
        case "i":
            document.getElementById("sentence").textContent = "Some helpful information ;)"
            document.getElementById("words").textContent = otherdata
            break
        case "l":
            neutral()
            document.getElementById("sentence").textContent = "New letter"
            document.getElementById("letter").innerHTML = `${otherdata.toUpperCase()}${otherdata}<span style='color: #D3AF86'> (${languageData[language].alphabet[otherdata]})</span>`
            document.getElementById("pronunciation").innerHTML = ipa[languageData[language].toIPA[languageData[language].alphabet[otherdata]]].replace(/\[/g, "<span>").replace(/\]/g, "</span>")
            break
        case "t":
            document.getElementById("input").value = ""
            document.getElementById("sentence").textContent = `Transliterate this ${otherdata.length > 1 ? "word": "letter"} to Latin`
            document.getElementById("letter").textContent = otherdata
            for(b of document.getElementsByClassName("key")) b.textContent = ""
            if(otherdata.charCodeAt(0) > 1000){
                for(ltr of "QWERTYUIOPASDFGHJKLZXCVBNM".split("")) document.getElementById("Key" + ltr).textContent = ltr.toLowerCase()
                for(letr in languageData[language].latinKeyboard) document.getElementById("Digit" + (+letr + 1)).textContent = languageData[language].latinKeyboard[letr]
            }
            else{
                for(letr of Object.entries(languageData[language].nativeKeyboard)) document.getElementById(letr[0]).textContent = letr[1]
            }
            for(b of document.getElementsByClassName("key")) b.style.backgroundColor = b.textContent == "" ? "#6c71c4" : "#D3AF86"
            break
        case "d":
            document.getElementById("input").value = ""
            document.getElementById("sentence").textContent = `What is the English translation of this word?`
            for(b of document.getElementsByClassName("key")) b.textContent = ""
            for(ltr of "QWERTYUIOPASDFGHJKLZXCVBNM".split("")) document.getElementById("Key" + ltr).textContent = ltr.toLowerCase()
            document.getElementById("letter").textContent = otherdata.split(">")[0]
            for(b of document.getElementsByClassName("key")) b.style.backgroundColor = b.textContent == "" ? "#6c71c4" : "#D3AF86"
            break
    }
}
function multchoice(answer){
    (answer.toUpperCase() == document.getElementById("letter").textContent.toUpperCase()) ? right() : wrong()
    document.getElementById("multiplechoice").style.display = "none"
}
function next(){
    exercise++
    exercise > languageData[language].plan[lesson-1].length ? unformat() : format(languageData[language].plan[lesson-1][exercise-1])
}
function right(){
    document.getElementById("continue").style.display = ""
    document.getElementById("continue").textContent = "Correct! :) Continue..."
    document.getElementById("continue").className = "widebutton correct"

}
function wrong(){
    document.getElementById("continue").style.display = ""
    document.getElementById("continue").textContent = "Incorrect! :( Continue..."
    document.getElementById("continue").className = "widebutton incorrect"
}
function neutral(){
    document.getElementById("continue").style.display = ""
    document.getElementById("continue").textContent = "Continue..."
    document.getElementById("continue").className = "widebutton neutral"
}
function enter(){
    document.getElementById("enterbutton").style.display = "none"
    ans = document.getElementById("input").value
    if(questiontype == "t"){
        lett = document.getElementById("letter").textContent
        if(lett.charCodeAt(0) > 1000){
            if(tlit(lett) == ans) right()
            else wrong()        
        }
        else{
            if(tlit(ans) == lett) right()
            else wrong()
        }
        if((tlit(lett) == ans) || (ans == tlit(lett))) right()
        else wrong()
    }
    else if(questiontype == "d"){
        if(ans.toLowerCase() == languageData[language].plan[lesson-1][exercise-1].split(">")[1].toLowerCase()) right()
        else wrong()
    }
}
function tlit(word){
    switch(language){
        case "armenian":
            for(f of Object.entries(languageData[language].alphabet)){
                regex = new RegExp(f[0], "g")
                word = word.replace(regex, f[1])
            }
            return word
            break
    }
}

function sound(){
    audio = new Audio("sounds/" + languageData[language].toIPA[languageData[language].alphabet[document.getElementById("letter").textContent.charAt(1)]] + ".ogg")
    audio.play()
}

document.addEventListener('keydown', (e) => {
    if(document.getElementById("input") == document.activeElement) event.preventDefault()

    if(document.getElementById(e.code) != null){
        document.getElementById(e.code).style.backgroundColor = "#DC3958"
        entertext(e.code)
        /*if(document.getElementById("input") != document.activeElement) entertext(e.code)
        else if(e.code == "Enter"){
            if(document.getElementById("continue").style.display != "none") next()
            else if(document.getElementById("enterbutton").style.display != "none") enter()
        }
        else{
            if(document.getElementById(e.code).textContent != undefined){
                entertext(e.code)
            }
        }*/
    }
})
document.addEventListener('keyup', (e) => {
    if(document.getElementById(e.code).className.includes("blue")) document.getElementById(e.code).style.backgroundColor = "#268bd2"
    else if(document.getElementById(e.code).className.includes("orange")) document.getElementById(e.code).style.backgroundColor = "#F06431"
    else if(document.getElementById(e.code).textContent == "") document.getElementById(e.code).style.backgroundColor = "#6c71c4"
    else document.getElementById(e.code).style.backgroundColor = "#D3AF86"
})

function entertext(code){
    if(code == "Backspace") document.getElementById("input").value = document.getElementById("input").value.slice(0, document.getElementById("input").value.length - 1)
    else if(code == "Enter"){
        if(document.getElementById("continue").style.display != "none") next()
        else if(document.getElementById("enterbutton").style.display != "none") enter()
    }
    else if(code != "ShiftLeft" && code != "ShiftRight") document.getElementById("input").value += document.getElementById(code).textContent
}

window.addEventListener("load", function(){
    for(r of Object.keys(languageData)){
        for(t in languageData[r].plan) document.getElementById(r + "-levels").innerHTML += `<div onclick="preformat('${r}', ${+t+1})">Level<br />${+t+1}</div>`
    }
})