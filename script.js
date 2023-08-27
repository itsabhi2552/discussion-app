const load_data = JSON.parse(localStorage.getItem("data"));
var question_id = JSON.parse(localStorage.getItem("question_id"));
var response_id = JSON.parse(localStorage.getItem("response_id"));

const response = document.getElementById("response");
const container = document.getElementById("container");
const search = document.getElementById("search");
const submit_btn = document.getElementById("submit-btn");
const resolve_btn = document.getElementById("resolve-btn");
const favorite_btn = document.getElementById("favorite-btn");
const question_btn = document.getElementById("new-question-btn");
const response_submit_btn = document.getElementById("response-submit-btn");

var ms = 5000;
var index = -1;
var question_arr = [];
var favorite_btn_flag = true;

if (!question_id) {
    question_id = 1;
}

if (!response_id) {
    response_id = 1;
}

if (load_data) {
    question_arr = load_data;
    question_arr.sort(function(a, b) {
        if(a.favorite) {
            return -1;
        } else if(b.favorite) {
            return 1;
        } else {
            return 0;
        }
    });
    for (let i = 0; i < question_arr.length; i++) {
        container.appendChild(generate(question_arr[i]));
    }
}

function upload_data() {
    localStorage.setItem("data", JSON.stringify(question_arr));
    localStorage.setItem("question_id", JSON.stringify(question_id));
    localStorage.setItem("response_id", JSON.stringify(response_id));
}

function store_data(value_a, value_b, id = -1) {
    let parent;
    let data = {
        id: 0,
        data_a: "",
        data_b: "",
        created_at: 0,
        likes: 0,
        dislikes: 0,
        favorite: false
    }

    data.data_a = value_a;
    data.data_b = value_b;
    data.created_at = Date.now();

    if (id === -1) {
        parent = container;
        data.id = question_id++;
        data.arr = [];
        question_arr.push(data);
    } else {
        parent = response;
        data.parent_id = id;
        data.id = response_id++;
        question_arr[index].arr.push(data);
    }

    parent.appendChild(generate(data));
    upload_data();
}

function error(name, value) {
    let text = document.getElementById(name + "-error");

    text.innerText = "";

    if (value === "") {
        text.innerText = "*" + name + " field is mandatory";
    } else {
        let size = value.length;

        while (size--) {
            if (value[size] !== " ") {
                return false;
            }
        }

        text.innerText = "*" + name + " field must containe at-least 1 character";
    }
    return true;
}

function checkError(name1, value1, name2, value2) {
    let flag1 = error(name1, value1);
    let flag2 = error(name2, value2);

    return (flag1 || flag2);
}

function calculate_time(actual_time) {
    let seconds = parseInt((Date.now() - actual_time) / 1000);

    if (seconds > 59) {
        let minutes = parseInt(seconds / 60);
        if (minutes > 59) {
            let hours = parseInt(minutes / 60);
            ms = (1000 * 60 * 60);
            return hours + " hours ago";
        } else {
            ms = (1000 * 60);
            return minutes + " minutes ago";
        }
    } else {
        ms = 5000;
        return seconds + " seconds ago";
    }
}

setInterval(function () {
    let i = 0;
    let actual_time;

    while(i < container.childNodes.length) {
        for(j = 0; j < question_arr.length; j++) {
            if(container.childNodes[i].id == question_arr[j].id) {
                actual_time = question_arr[j].created_at;
                break;
            }
        }
        container.childNodes[i].lastChild.firstChild.innerText = calculate_time(actual_time);
        i++;
    }
}, ms);

function create_row(cls, id) {
    let row = document.createElement("div");
    row.setAttribute("class", cls);
    row.setAttribute("id", id);
    return row;
}

function create_col(cls) {
    let col = document.createElement("div");
    col.setAttribute("class", cls);
    return col;
}

function create_time(actual_time) {
    let div = document.createElement("div");
    div.setAttribute("class", "my-3 time");
    div.innerText = calculate_time(actual_time);
    return div;
}

function create_like(likes) {
    let div = document.createElement("div");
    div.setAttribute("class", "fa fa-thumbs-up mx-2 my-3 like");
    div.setAttribute("value", "like");
    div.innerText = likes;
    return div;
}

function create_dislike(dislikes) {
    let div = document.createElement("div");
    div.setAttribute("class", "fa fa-thumbs-down mx-2 my-3 dislike");
    div.setAttribute("value", "dislike");
    div.innerText = dislikes;
    return div;
}

function create_favorite(favorite) {
    let div = document.createElement("div");
    div.setAttribute("class", "fa fa-star ml-2 my-3 favorite");
    div.setAttribute("value", "favorite");


    if (favorite === false) {
        div.setAttribute("style", "color: white");
    } else {
        div.setAttribute("style", "color: orange");
    }

    return div;
}

function create_icon(likes, dislikes, favorite_flag) {
    let div = document.createElement("div");
    let like = create_like(likes);
    let dislike = create_dislike(dislikes);
    let favorite = create_favorite(favorite_flag);

    div.setAttribute("class", "d-flex justify-content-between");

    div.appendChild(like);
    div.appendChild(dislike);
    div.appendChild(favorite);

    return div
}

function generate(recieved_data) {
    let row = create_row("row pt-3", recieved_data.id);
    let col1 = create_col("col-12 pb-3");
    let col2 = create_col("col-12 d-flex justify-content-between");
    let div1 = document.createElement("div");
    let div2 = document.createElement("div");
    let div3 = create_time(recieved_data.created_at);
    let div4 = create_icon(recieved_data.likes, recieved_data.dislikes, recieved_data.favorite);

    div1.innerHTML = "<h3>" + recieved_data.data_a + "</h3>";
    div2.innerText = recieved_data.data_b;

    row.setAttribute("style", "background-color: rgba(194, 189, 189, 0.445)");

    col1.appendChild(div1);
    col1.appendChild(div2);
    col2.appendChild(div3);
    col2.appendChild(div4);
    row.appendChild(col1);
    row.appendChild(col2);

    return row;
}

question_btn.addEventListener("click", function () {
    let second_col = document.getElementById("second-col");
    let third_col = document.getElementById("third-col");
    let subject = document.getElementById("subject");
    let question = document.getElementById("question");
    let subject_error = document.getElementById("subject-error");
    let question_error = document.getElementById("question-error");

    subject.value = "";
    question.value = "";
    subject_error.innerText = "";
    question_error.innerText = "";

    if (!favorite_btn_flag) {
        favorite_btn_flag = true;

        while (container.firstChild) {
            container.firstChild.remove();
        }

        for (let i = 0; i < question_arr.length; i++) {
            container.appendChild(generate(question_arr[i]));
        }
    }

    second_col.setAttribute("style", "display: block");
    third_col.setAttribute("style", "display: none");
});

search.addEventListener("input", function () {
    let second_col = document.getElementById("second-col");
    let third_col = document.getElementById("third-col");

    while (container.firstChild) {
        container.firstChild.remove();
    }

    if (search.value === "") {
        for (let i = 0; i < question_arr.length; i++) {
            container.appendChild(generate(question_arr[i]));
        }
    } else {
        for (let i = 0; i < question_arr.length; i++) {
            if (question_arr[i].data_a.includes(search.value) || question_arr[i].data_b.includes(search.value)) {
                container.appendChild(generate(question_arr[i]));
            }
        }
    }

    second_col.setAttribute("style", "display: block");
    third_col.setAttribute("style", "display: none");
});

favorite_btn.addEventListener("click", function () {
    let second_col = document.getElementById("second-col");
    let third_col = document.getElementById("third-col");

    search.value = "";

    while (container.firstChild) {
        container.firstChild.remove();
    }

    if (favorite_btn_flag) {
        favorite_btn_flag = false;
        for (let i = 0; i < question_arr.length; i++) {
            if (question_arr[i].favorite) {
                container.appendChild(generate(question_arr[i]));
            }
        }
    } else {
        favorite_btn_flag = true;
        for (let i = 0; i < question_arr.length; i++) {
            container.appendChild(generate(question_arr[i]));
        }
    }

    second_col.setAttribute("style", "display: block");
    third_col.setAttribute("style", "display: none");
});

submit_btn.addEventListener("click", function () {
    let subject = document.getElementById("subject");
    let question = document.getElementById("question");
    if (!checkError("subject", subject.value, "question", question.value)) {
        store_data(subject.value, question.value);
        subject.value = "";
        question.value = "";
    }
});

resolve_btn.addEventListener("click", function () {
    let temp_arr = [];
    for (let i = 0; i < question_arr.length; i++) {
        if (i != index) {
            temp_arr.push(question_arr[i]);
        }
    }
    question_arr = temp_arr;
    upload_data();

    while(container.firstChild) {
        container.firstChild.remove();
    }

    for(let i = 0 ; i < question_arr.length; i++) {
        container.appendChild(generate(question_arr[i]));
    };

    let second_col = document.getElementById("second-col");
    let third_col = document.getElementById("third-col");

    second_col.setAttribute("style", "display: block");
    third_col.setAttribute("style", "display: none");
});

response_submit_btn.addEventListener("click", function () {
    let name_input = document.getElementById("name");
    let show_response = document.getElementById("show-response");
    let response_input = document.getElementById("response-input");
    if (!checkError("name", name_input.value, "response", response_input.value)) {
        store_data(name_input.value, response_input.value, question_arr[index].id);

        if(response.hasChildNodes) {
            show_response.setAttribute("style", "display: block");
        } else {
            show_response.setAttribute("style", "display: none");
        }
        name_input.value = "";
        response_input.value = "";
    }
});

function show_response_col() {
    let second_col = document.getElementById("second-col");
    let third_col = document.getElementById("third-col");
    let name = document.getElementById("name");
    let name_error = document.getElementById("name-error");
    let show_response = document.getElementById("show-response");
    let response_input = document.getElementById("response-input");
    let response_error = document.getElementById("response-error");
    let response_question = document.getElementById("response-question");

    while (response_question.firstChild) {
        response_question.firstChild.remove();
    }

    name.value = "";
    response_input.value = "";
    name_error.innerText = "";
    response_error.innerText = "";

    let div1 = document.createElement("div");
    let div2 = document.createElement("div");

    div1.innerHTML = "<h6>" + question_arr[index].data_a + "</h6>";
    div2.innerText = question_arr[index].data_b;

    div2.setAttribute("class", "pt-2");

    response_question.appendChild(div1);
    response_question.appendChild(div2);

    while (response.firstChild) {
        response.firstChild.remove();
    }

    let temp_arr = [];

    for (let i = 0; i < question_arr[index].arr.length; i++) {
        temp_arr.push(generate(question_arr[index].arr[i]));
    }

    temp_arr.sort(function (a, b) {
        let value_a = a.lastChild.lastChild.childNodes[0].innerText - a.lastChild.lastChild.childNodes[1].innerText;
        let value_b = b.lastChild.lastChild.childNodes[0].innerText - b.lastChild.lastChild.childNodes[1].innerText;
        return (value_b - value_a);
    });

    for (let i = 0; i < temp_arr.length; i++) {
        response.appendChild(temp_arr[i]);
    }

    if (!response.firstChild) {
        show_response.setAttribute("style", "display: none");
    } else {
        show_response.setAttribute("style", "display: block");
    }

    second_col.setAttribute("style", "display: none");
    third_col.setAttribute("style", "display: block");
}

container.addEventListener("click", function (event) {
    let i = 0;
    let target = event.target;
    let event_name = target.getAttribute("value");

    while (target.id === "") {
        target = target.parentNode;
    }

    while (i < question_arr.length) {
        if (question_arr[i].id == target.id) {
            index = i;
            break;
        }
        i++;
    }

    if (event_name) {
        if (event_name === "like") {
            question_arr[i].likes++;
            event.target.innerText = question_arr[i].likes;
        } else if (event_name === "dislike") {
            question_arr[i].dislikes++;
            event.target.innerText = question_arr[i].dislikes;
        } else if (question_arr[i].favorite) {
            question_arr[i].favorite = false;
            event.target.setAttribute("style", "color: white");
        } else {
            question_arr[i].favorite = true;
            event.target.setAttribute("style", "color: orange");
        }
        upload_data();
    } else {
        show_response_col();
    }
});

response.addEventListener("click", function (event) {
    let i = 0;
    let target = event.target;
    let event_name = target.getAttribute("value");

    while (target.id === "") {
        target = target.parentNode;
    }

    while (i < question_arr[index].arr.length) {
        if (question_arr[index].arr[i].id == target.id) {
            break;
        }
        i++;
    }

    if (event_name) {
        if (event_name === "like") {
            question_arr[index].arr[i].likes++;
            event.target.innerText = question_arr[index].arr[i].likes;
        } else if (event_name === "dislike") {
            question_arr[index].arr[i].dislikes++;
            event.target.innerText = question_arr[index].arr[i].dislikes;
        } else if (question_arr[index].arr[i].favorite) {
            question_arr[index].arr[i].favorite = false;
            event.target.setAttribute("style", "color: white");
        } else {
            question_arr[index].arr[i].favorite = true;
            event.target.setAttribute("style", "color: orange");
        }
        upload_data();
    }
});