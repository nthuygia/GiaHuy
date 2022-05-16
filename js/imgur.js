/* Imgur Upload Script */
(function (root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Imgur = factory();
    }
}(this, function () {
    "use strict";
    var Imgur = function (options) {
        if (!this || !(this instanceof Imgur)) {
            return new Imgur(options);
        }

        if (!options) {
            options = {};
        }

        if (!options.clientid) {
            throw 'Provide a valid Client Id here: https://api.imgur.com/';
        }

        this.clientid = options.clientid;
        this.endpoint = 'https://api.imgur.com/3/image';
        this.callback = options.callback || undefined;
        this.dropzone = document.querySelectorAll('.dropzone');
        this.infoimg = document.querySelectorAll('.infoimg');

        this.run();
    };

    Imgur.prototype = {
        createEls: function (name, props, text) {
            var el = document.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            if (text) {
                el.appendChild(document.createTextNode(text));
            }
            return el;
        },
        insertAfter: function (referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        },
        post: function (path, data, callback) {
            var xhttp = new XMLHttpRequest();

            xhttp.open('POST', path, true);
            xhttp.setRequestHeader('Authorization', 'Client-ID ' + this.clientid);
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 300) {
                        var response = '';
                        try {
                            response = JSON.parse(this.responseText);
                        } catch (err) {
                            response = this.responseText;
                        }
                        callback.call(window, response);
                    } else {
                        throw new Error(this.status + " - " + this.statusText);
                    }
                }
            };
            xhttp.send(data);
            xhttp = null;
        },
        createDragZone: function () {
            var p1, p2, input;

                p1 = this.createEls('p', {}, 'Kéo file ảnh vào đây');
                p2 = this.createEls('p', {}, 'Hoặc click để chọn ảnh');
            input = this.createEls('input', {type: 'file', className: 'input', accept: 'image/*'});

            Array.prototype.forEach.call(this.infoimg, function (zone) {
                zone.appendChild(p1);
                zone.appendChild(p2);
            }.bind(this));
            Array.prototype.forEach.call(this.dropzone, function (zone) {
                zone.appendChild(input);
                this.status(zone);
                this.upload(zone);
            }.bind(this));
        },
        loading: function () {
            var div, table, img;

            div = this.createEls('div', {className: 'loading-modal'});
            table = this.createEls('table', {className: 'loading-table'});
            img = this.createEls('img', {className: 'loading-image', src: 'https://firebasestorage.googleapis.com/v0/b/huydc-090288.appspot.com/o/Images%20Upload%2Floading-spin.svg?alt=media&token=8a1fd8dc-30b2-4b74-acc6-9e4ce55a89b0'});

            div.appendChild(table);
            table.appendChild(img);
            document.body.appendChild(div);
        },
        status: function (el) {
            var div = this.createEls('div', {className: 'status'});

            this.insertAfter(el, div);
        },
        matchFiles: function (file, zone) {
            var status = zone.nextSibling;

            if (file.type.match(/image/) && file.type !== 'image/svg+xml') {
                document.body.classList.add('loading');
                status.classList.remove('bg-success', 'bg-danger');
                status.innerHTML = '';

                var fd = new FormData();
                fd.append('image', file);

                this.post(this.endpoint, fd, function (data) {
                    document.body.classList.remove('loading');
                    typeof this.callback === 'function' && this.callback.call(this, data);
                }.bind(this));
            } else {
                status.classList.remove('bg-success');
                status.classList.add('bg-danger');
                status.innerHTML = 'Invalid archive';
            }
        },
        upload: function (zone) {
            var events = ['dragenter', 'dragleave', 'dragover', 'drop'],
                file, target, i, len;

            zone.addEventListener('change', function (e) {
                if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                    target = e.target.files;

                    for (i = 0, len = target.length; i < len; i += 1) {
                        file = target[i];
                        this.matchFiles(file, zone);
                    }
                }
            }.bind(this), false);

            events.map(function (event) {
                zone.addEventListener(event, function (e) {
                    if (e.target && e.target.nodeName === 'INPUT' && e.target.type === 'file') {
                        if (event === 'dragleave' || event === 'drop') {
                            e.target.parentNode.classList.remove('dropzone-dragging');
                        } else {
                            e.target.parentNode.classList.add('dropzone-dragging');
                        }
                    }
                }, false);
            });
        },
        run: function () {
            var loadingModal = document.querySelector('.loading-modal');

            if (!loadingModal) {
                this.loading();
            }
            this.createDragZone();
        }
    };

    return Imgur;
}));

/* Client ID Imgur */
var feedback = function(res) {
    if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, 'https://');
        document.querySelector('.status').classList.add('bg-success');
        document.querySelector('.status').innerHTML =
            '<div class="linkimg"><input class="image-url" id="copylinkimg" onclick="this.select()" value=\"' + get_link + '\"/></div>' + '<div class="showimg"><img class="img" alt="Imgur-Upload" src=\"' + get_link + '\"/></div>';
    }
};

new Imgur({
    clientid: '72100ba3c6aded1',
    callback: feedback
});