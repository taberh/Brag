
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
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                opt.success && opt.success(JSON.parse(xhr.responseText));
            }
            else if (xhr.status > 300) {
                opt.error && opt.error();
            }
        }
    };
    xhr.onerror = xhr.onabort = function() {
        opt.error && opt.error();
    }

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
