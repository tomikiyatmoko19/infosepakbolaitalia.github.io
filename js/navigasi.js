document.addEventListener("DOMContentLoaded", function() {
    var elemens = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elemens);
    loadNav();
   
    function loadNav() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status != 200) return;

          document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
            elm.innerHTML = xhttp.responseText;
          });

          document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
            elm.addEventListener("click", function(event) {

              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
        }
      };
      xhttp.open("GET", "halaman/navigasi.html", true);
      xhttp.send();
    }
  });

    var sliders = window.location.hash.substr(1);
    LoadFooter();

    function LoadFooter(){
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
          var content = document.querySelector("#footer-content");
          if (this.status == 200) {
              content.innerHTML = xhttp.responseText;
          }else {
              content.innerHTML = "<p>Ups.. halaman gagal dimuat.</p>";
          }
          }
          (function($){
            $(function(){
            }); 
          })(jQuery); 
      };
      xhttp.open("GET", "halaman/footer.html", true);
      xhttp.send();
    }

    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);
    
    function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
            content.innerHTML = xhttp.responseText;
            if(page === 'home') getKlasemen();
            if(page === 'home') getTim();
            if(page === 'klasemen') getKlasemen();
            if(page === 'tim') getTim();
            if(page === 'favorit') elTimFavorit();
        } else if (this.status == 404) {
            content.innerHTML = "<p>Tidak ditemukan.</p>";
        } else {
            content.innerHTML = "<p>Tidak dapat diakses.</p>";
        }
        }
        document.querySelectorAll(".plan-signup-btn a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
        (function($){
          $(function(){
              $(document).ready(function(){
                  $('.slider').slider({
                    fullWidth: true,
                    indicators : false,
                    height : 500
                  });
                  $('.parallax').parallax();
                  $('.materialboxed').materialbox();
                  $('.carousel').carousel({
                    indicators : true,
                    height : 820,
                    fullWidth: true
                  });
                  $('.datepicker').datepicker();
              });
              
          }); 
        })(jQuery);
    };
    xhttp.open("GET", `halaman/${page}.html`, true);
    xhttp.send();
    }
    