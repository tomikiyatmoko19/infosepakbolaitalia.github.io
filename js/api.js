var BASE_URL = "https://api.football-data.org/v2/";
var API_KEY = "ddf74c97759745c3a91a9b8e179f3702";
var LEAGUE_ID = 2019;
var klasemen = `${BASE_URL}competitions/${LEAGUE_ID}/standings`;
var tim = `${BASE_URL}competitions/${LEAGUE_ID}/teams`;
var jadwal = `${BASE_URL}competitions/${LEAGUE_ID}/matches`;
var dataTim;

var fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': API_KEY
        }
    })
        .then(res => {
            if (res.status !== 200) {
                console.log(`Error:${res.status}`);
                return Promise.reject(new Error(res.statusText))
            } else {
                return Promise.resolve(res)
            }
        })
        .then(res => res.json())
        .catch(err => {
            console.log(err)
        })
};

function getKlasemen() {
    fetchAPI(klasemen)
        .then(data => {
            showKlasemen(data);
        })
        .catch(error => {
          if ("caches" in window) {
            caches.match(klasemen).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        showKlasemen(data);
                    })
                }
            })
        }else{
          console.log(error)
        }
        })
}

function showKlasemen(data) {
    showLoader();
    let standings = "";
    let standingElement =  document.getElementById("main-contentk");
    hideLoader();

    data.standings[0].table.forEach(function (standing) {
        standings += `
                <tr>
                    <td>${standing.position}</td>
                    <td><img src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" width="30px" alt="badge"/></td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>
        `;
    });

    standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">

                <table class="striped centered responsive-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th></th>
                            <th>Team Name</th>
                            <th>W</th>
                            <th>D</th>
                            <th>L</th>
                            <th>P</th>
                            <th>GF</th>
                            <th>GA</th>
                            <th>GD</th>
                        </tr>
                     </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
}

function getTim() {
    fetchAPI(tim)
        .then(data => {
            showTim(data);
        })
        .catch(error => {
          if ("caches" in window) {
            caches.match(tim).then(function (response) {
                if (response) {
                    response.json().then(function (data) {
                        showTim(data);
                    })
                }
            })
        }else{
          console.log(error)
        }
        })
}

function showTim(data) {
    showLoader();
    dataTim = data;
    var tims = "";
    data.teams.forEach(function (tim) {
        tims += `
        <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${tim.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${tim.name}</div>
            <div class="center">${tim.area.name}</div>
          </div>
          <div class="card-action center-align">
              <a class="waves-effect waves-light btn-small blue" onclick="insertTeamListener(${tim.id}); this.onclick=null;">Favoritku</a>
          </div>
        </div>
      </div>
        `;
    });
    document.getElementById("main-content").innerHTML = tims;
    hideLoader();
}

var elTimFavorit = () => {
  var teams = getTimfav()
  showLoader();

  teams.then(data => {
    dataTim = data;
    var html = ' '
    html += '<div class="row">'
    data.forEach(tim => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${tim.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${tim.name}</div>
            <div class="center">${tim.area.name}</div>
          </div>
          <div class="card-action center-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteTeamListener(${tim.id})">HAPUS DARI FAVORIT</a>
          </div>
        </div>
      </div>
    `
    })

    if(data.length == 0) html += '<h6 class="No tim favorit!</6>'

    html += "</div>"
    let doc = document.getElementById('main-content');
    doc.innerHTML = html;
    hideLoader();
  })
}

// database operations
var dbx = idb.open('sepakbola', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('tim', { 'keyPath': 'id' })
  }
});



var insertTeam = (tim) => {
  dbx.then(db => {
    var tx = db.transaction('tim', 'readwrite');
    var store = tx.objectStore('tim')
    tim.createdAt = new Date().getTime()
    store.put(tim)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `${tim.name} sukses disimpan!` })
    console.log('Pertandingan sukses disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

var deleteTeam = (idTim) => {
  dbx.then(db => {
    var tx = db.transaction('tim', 'readwrite');
    var store = tx.objectStore('tim');
    store.delete(idTim);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Tim Sudah Di Hapus!' });
    elTimFavorit();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

var getTimfav = () => {
  return dbx.then(db => {
    var tx = db.transaction('tim', 'readonly');
    var store = tx.objectStore('tim');
    return store.getAll();
  })
}



var insertTeamListener = idTim => {
  var tim = dataTim.teams.filter(el => el.id == idTim)[0]
  insertTeam(tim);
}

var deleteTeamListener = idTim => {
  var c = confirm("Yakin Hapus Tim Ini dari Favorit?")
  if (c == true) {
    deleteTeam(idTim);
  }
}

var showLoader = () => {
  var html = `<div class="preloader-wrapper medium active">
              <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
              </div>`
    let doc = document.getElementById('loader');          
    doc.innerHTML = html;
}

var hideLoader = () => {
  let doc = document.getElementById('loader');
  doc.innerHTML = '';
}
