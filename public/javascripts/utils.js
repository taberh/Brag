
function ajax(opt) {
    var xhr = new XMLHttpRequest();

    if (!opt.method) opt.method = 'GET';

    opt.method = opt.method.toUpperCase();

    if (opt.params) {
        opt.params = formatParams(opt.params);

        if (opt.method === 'GET') {
            opt.url += '?';
            opt.url += opt.params;
            delete opt.params;
        }
    }

    xhr.open(opt.method, opt.url, true);
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            opt.success(JSON.parse(xhr.responseText));
        }
    };

    if (opt.method === 'POST') {
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }

    xhr.send(opt.params);
}

function formatParams(params) {
    var f = '', k;

    for (k in params) {
        f += (k + '=' + params[k]);
        f += '&';
    }

    return f.replace(/&$/, '');
}
