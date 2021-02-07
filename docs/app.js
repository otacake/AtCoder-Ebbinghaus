
function elementSetTextContent(element,str) {
    if (element.textContent !== undefined) {
        element.textContent = str;
    }
    if (element.innerText !== undefined) {
        element.innerText = str;
    }
}

function getAtCoder() {
    let handle = document.getElementById("id-AtCoder").value;
    const url = "https://kenkoooo.com/atcoder/atcoder-api/results?user="+handle;
    const now = new Date();
    const day = 24*60*60;
    const time_diff = 9*60*60;
    const today = Math.floor((now.getTime()/1000 + time_diff)/day) * day - time_diff;
    const yesterday = today  - day;
    const week = today - 7*day;
    const month = today - 31*day;

    let before1day = {};
    let before1week = {};
    let before1month = {};

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        for (let i = 0; i < json.length; i++) {
            if (json[i].result == "AC") {
                continue;
            }
            let time = Number(json[i].epoch_second);
            let id = json[i].problem_id;
            let result = json[i].result;
            let con_id = json[i].contest_id;
            if (month <= time  && time < week) {
                if (before1month[id] == undefined) {
                    before1month[id] = [con_id,result];
                }
            }
            if (week <= time && time < yesterday) {
                if (before1week[id] == undefined) {
                    before1week[id] = [con_id,result];
                }
            }
            if (time >= yesterday) {
                if (before1day[id] == undefined) {
                    before1day[id] = [con_id,result];
                }
            }
        }
        console.log(before1week);

        let elem = document.getElementById('times');

        let until = elem.value;

        if (until == '1day') {
            makeProblemsTable(before1day,"problems_list");
        }

        if (until == '1week') {
            makeProblemsTable(before1week,"problems_list");
        }

        if (until == '1month') {
            makeProblemsTable(before1month,"problems_list");
        }
    })
}

function makeProblemsTable(problems,div_id) {
    let div = document.getElementById(div_id)
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    let table = document.createElement('table');
    const url = "https://kenkoooo.com/atcoder/resources/problems.json";
    let keys = Object.keys(problems);
    let prob_names = {};

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        for (let i = 0; i < json.length; i++) {
            let id = json[i].id;
            if (keys.includes(id)) {
                prob_names[id] = json[i].title;
            }
        };
        console.log(prob_names);
        let tr0 = document.createElement('tr');
        let header = ['問題名',"結果","upsolved"];
        for (let i = 0; i < header.length; i++) {
            let th = document.createElement('th');
            th.textContent = header[i];
            tr0.appendChild(th);
        };
        table.appendChild(tr0);
        //console.log(keys);

        for (let i = 0; i < keys.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < 3; j++) {
                let td = document.createElement('td');
                if (j == 0) {
                    let a = document.createElement('a');
                    let pro_url = "https://atcoder.jp/contests/"+problems[keys[i]][j]+"/tasks/"+keys[i];
                    a.href = pro_url;
                    a.target = "_blank";
                    td.appendChild(a);
                    let prob_name = prob_names[keys[i]];
                    elementSetTextContent(a,prob_name);
                    tr.appendChild(td);
                    console.log("OK");
                };
                if (j == 1) {
                    td.textContent = problems[keys[i]][j];
                    tr.appendChild(td);
                };
                if (j == 2) {
                    let check = document.createElement('input');
                    check.type = 'checkbox';
                    td.appendChild(check);
                    tr.appendChild(td);
                };
            };
            table.appendChild(tr);
        };

        document.getElementById(div_id).appendChild(table);


    })

}
