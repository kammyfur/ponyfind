<?php

function translate($query, $from = "en", $to = "fr", $raw = false) {
    exec('curl -s -X POST "https://translate.google.com/_/TranslateWebserverUi/data/batchexecute?rpcids=MkEWBc&f.sid=1357830799902513577&bl=boq_translate-webserver_20220105.11_p0&hl=en&soc-app=1&soc-platform=1&soc-device=1&_reqid=868132&rt=c" -H "Content-Type: application/x-www-form-urlencoded" -d "f.req=%5B%5B%5B%22MkEWBc%22%2C%22%5B%5B%5C%22' . urlencode($query) . '%5C%22%2C%5C%22en%5C%22%2C%5C%22fr%5C%22%2Ctrue%5D%2C%5Bnull%5D%5D%22%2Cnull%2C%22generic%22%5D%5D%5D&at=AD08yZliLrvDYq8ejjtAuBLKj9ow%3A1641664530702&"', $result);
    if (isset($result[3]) && isset(json_decode($result[3])[0]) && isset(json_decode($result[3])[0][2])) {
        echo(json_decode(json_decode($result[3])[0][2])[1][0][0][5][0][0]);
    } else {
        echo($query);
    }
}

if (isset($_SERVER['argv'][1])) {
    translate($_SERVER['argv'][1], "en", "fr", false);
} else {
    echo("");
}