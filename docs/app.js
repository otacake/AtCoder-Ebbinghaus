
function elementSetTextContent(element,str) {
    if (element.textContent !== undefined) {
        element.textContent = str;
    }
    if (element.innerText !== undefined) {
        element.innerText = str;
    }
}

function getAtCoder() {
    var handle = document.getElementById("id-AtCoder").value;
    var url = "https://kenkoooo.com/atcoder/atcoder-api/results?user="+handle;
    var now = new Date();
    var day = 24*60*60;
    var time_diff = 9*60*60;
    var today = Math.floor((now.getTime()/1000 + time_diff)/day) * day - time_diff;
    var yesterday = today  - day;
    var week = today - 7*day;
    var month = today - 31*day;

    var before1day = {};
    var before1week = {};
    var before1month = {};

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].result == "AC") {
                continue;
            }
            var time = Number(json[i].epoch_second);
            var id = json[i].problem_id;
            var result = json[i].result;
            var con_id = json[i].contest_id;
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

        var elem = document.getElementById('times');

        var until = elem.value;

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
    var div = document.getElementById(div_id)
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    var table = document.createElement('table');
    var url = "https://kenkoooo.com/atcoder/resources/problems.json";
    var keys = Object.keys(problems);
    var prob_names = {};

    fetch(url).then(function(response) {
        return response.json();
    }).then(function(json) {
        for (var i = 0; i < json.length; i++) {
            var id = json[i].id;
            if (keys.includes(id)) {
                prob_names[id] = json[i].title;
            }
        }
        console.log(prob_names);
        var tr0 = document.createElement('tr');
        var header = ['問題名',"結果","upsolved"];
        for (var i = 0; i < header.length; i++) {
            var th = document.createElement('th');
            th.textContent = header[i];
            tr0.appendChild(th);
        }
        table.appendChild(tr0);
        //console.log(keys);

        for (var i = 0; i < keys.length; i++) {
            var tr = document.createElement('tr');
            for (var j = 0; j < 3; j++) {
                var td = document.createElement('td');
                if (j == 0) {
                    var a = document.createElement('a');
                    var pro_url = "https://atcoder.jp/contests/"+problems[keys[i]][j]+"/tasks/"+keys[i];
                    a.href = pro_url;
                    a.target = "_blank";
                    td.appendChild(a);
                    var prob_name = prob_names[keys[i]];
                    elementSetTextContent(a,prob_name);
                    tr.appendChild(td);
                    console.log("OK");
                }
                if (j == 1) {
                    td.textContent = problems[keys[i]][j];
                    tr.appendChild(td);
                }
                if (j == 2) {
                    var check = document.createElement('input');
                    check.type = 'checkbox';
                    td.appendChild(check);
                    tr.appendChild(td);
                }
            }
            table.appendChild(tr);
        }

        document.getElementById(div_id).appendChild(table);


    })

}
