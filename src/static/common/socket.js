(function () {

    function log(message, type = 'log') {
        console[type]('Socket >>', message)
    }

    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    // script.onreadystatechange = onSocketScriptLoad
    script.onload = onSocketScriptLoad
    script.onerror = function () { console.error('Socket script loading error') }
    script.src = 'http://localhost:5001/socket.io/socket.io.js';
    head.appendChild(script);

    function onSocketScriptLoad() {
        log('скрипт загружен')

        const socket = io.connect('http://localhost:5001');
        setTimeout(() => {
            !socket.connected && log('нет подключения', 'warn')
        }, 1000);

        socket.on('connect', () => log('подключился к серверу хуков'));
        socket.on('disconnect', () => log('отключился от сервера хуков', 'warn'));

        socket.on('welcome', function (data) {
            log('зарегистрировался ' + JSON.stringify(data));
            socket.emit('auth', { msid: getCookie('msid') })
        });

        socket.on('incoming', function (data) {
            log('входящий звонок ' + JSON.stringify(data));
        });
    }

})();