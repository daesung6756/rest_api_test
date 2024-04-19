const include = {
    head : function (title) {
        document.write(`<meta charSet="UTF-8">`)
        document.write(`<title>${title}</title>`)
        document.write(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`)
        document.write(`<link rel="icon" type="image/png" href="./favicon.png" />`)
        document.write(`<link rel="stylesheet" href="./assets/css/reset.css">`)
        document.write(`<link rel="stylesheet" href="./assets/css/common.css">`)
    },
    loadScript : function () {
        document.write(`<script src="./assets/js/vendor/axios.min.js"></script>`)
        document.write(`<script src="./assets/js/vendor/chance.min.js"></script>`)
        document.write(`<script src="./assets/js/obj.js"></script>`)
        document.write(`<script src="./assets/js/common.js"></script>`)
    },
    header : function () {
        document.write(`<header id="header" class="header">`)
        document.write(`<div class = "inner" >`)
        document.write(`DKBMC MC사업부 generator v0.1.`)
        document.write(`</div>`)
        document.write(`</header>`)
    },
    footer : function () {
       document.write(`<footer id="footer" class="footer">`)
       document.write(`<div class="inner">`)
       document.write(`<P>copyright@ds,ms,yi</P>`)
       document.write(`</div>`)
       document.write(`</footer>`)
    },
    loader : function () {
       document.write(`<div id="loader" class='loader'><div class='spinner'><img src="./assets/images/svg/Spin@1x-1.0s-200px-200px.svg"></div></div>`)
    },
    popup : function () {

    }
}

