const include = {
    head : function (title) {
        document.write(`<meta charSet="UTF-8">`)
        document.write(`<title>${title}</title>`)
        document.write(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
        document.write(`<link rel="icon" type="image/png" href="./favicon.png" />`)
        document.write(`<link rel="stylesheet" href="./assets/css/reset.css">`)
        document.write(`<link rel="stylesheet" href="./assets/css/common.css">`)
    },
    header : function (isLogged = false) {
        document.write(`<header id="header" class="header">`)
        document.write(`<div class="inner">`)
        document.write(`<h1 class="title">SFMC용 Generator Set v0.1</h1>`)
        if(isLogged) {
            document.write(`<button onclick="logout()" type="button" id="logout" class="logout bg-orange">LOGOUT</button>`)
        }
        document.write(`</div>`)
        document.write(`</header>`)
    },
    footer : function () {
       document.write(`<footer id="footer" class="footer">`)
       document.write(`<div class="inner">`)
       document.write(`<p>© MC 2024. All rights reserved.<br>Produced by : DS.LEE, MS.NAM, YI.CHO</p>`)
       document.write(`</div>`)
       document.write(`</footer>`)
    },
    loader : function () {
       document.write(`<div id="loader" class='loader'><div class='spinner'><img src="./assets/images/svg/pulse.svg"></div></div>`)
    },
    loadScript : function (isLogged  = false) {
        document.write(`<script src="./assets/js/vendor/axios.min.js"></script>`)
        document.write(`<script src="./assets/js/vendor/chance.min.js"></script>`)
        if(isLogged) {
            document.write(`<script src="./assets/js/create-obj.js"></script>`)
        }
        document.write(`<script src="./assets/js/common.js"></script>`)
    },
}

