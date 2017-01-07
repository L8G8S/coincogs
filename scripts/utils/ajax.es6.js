'use strict';

/**
 * Generic class to perform ajax requests.
 */
class Ajax {

    /**
     * Gets a JSON object from the given url.
     * @param  {String} url The url address to get the JSON object from.
     * @return {Promise} a Promise to handle asynchronous response.
     */
    static getJSON(url, sync) {
        var xhr = new XMLHttpRequest();

        var p = new Promise(function(resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    else {
                        reject(xhr.responseText);
                    }
                }
            };
        });

        xhr.open('GET', url, !sync);
        xhr.send();

        return p;
    }

    static postJSON(url, params, sync) {
        var xhr = new XMLHttpRequest();

        var p = new Promise(function(resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    else {
                        reject(xhr.responseText);
                    }
                }
            };
        });

        xhr.open('POST', url, !sync);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params);

        return p;
    }

    /**
     * Gets raw HTML from the given url.
     * @param  {String} url The url address to get the HTML from.
     * @return {Promise} a Promise to handle asynchronous response.
     */
    static getHtml(url, sync) {
        var xhr = new XMLHttpRequest();

        var p = new Promise(function(resolve, reject) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }
                    else {
                        reject(xhr.responseText);
                    }
                }
            };
        });

        xhr.open('GET', url, !sync);
        xhr.send();

        return p;
    }
}