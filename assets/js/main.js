"use-strict"

var convo;

// load json file with formless data
window.onload = () => {
    loadJSON("main", res => startConversation(res))
}

function startConversation(json) {
    // add callback hooks..
    json.options.submitCallback = onFormlessSubmitted.bind(window);
    json.options.flowStepCallback = onStepCallback.bind(window);
    let md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
        json.options.hideUserInputOnNoneTextInput = true
    }
    convo = window.cf.ConversationalForm.startTheConversation(json)
    document.getElementById("cf-context").appendChild(convo.el)
}

// Form was submitted/finished
let onFormlessSubmitted = () => {
    convo.addRobotChatResponse("Thanks for chatting!")
}

let onStepCallback = function (dto, success, error) {
    console.log(dto)

    if (!dto.tag._values) {
        console.log("No conditional... continuing")
        success()
        return
    }

    let cond = dto.tag._values[0]
    console.log("Loading branch... " + cond)
    loadBranch(cond, (succ) => {
        if (!succ) {
            error()
        } else {
            success()
        }
    })
}

function loadBranch(branch, callback) {
    loadJSON(branch, (json) => {
        if (!json) {
            callback(false)
        } else {
            console.log(json.tags)
            convo.addTags(json.tags, true)
            callback(true)
        }
    })
}

// Loads JSON chat file
function loadJSON(name, callback) {
    let xhr = new XMLHttpRequest()
    xhr.overrideMimeType('application/json')
    xhr.onload = () => {
        callback(JSON.parse(xhr.responseText))
    }
    xhr.onerror = () => {
        callback(false)
    }

    xhr.open("GET", "assets/json/" + name + ".json")
    xhr.send(null)
}



