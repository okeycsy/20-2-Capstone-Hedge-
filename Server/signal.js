module.exports = {
    HTML:function(rows_html){
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <link rel="stylesheet" type="text/css" href='./css/signal.css'>
      </head>
      <body>
          <!--로고-->
          <div>
              <div class="container">
                  <a href="/main"><img src="./logo1.png" style = "width : 200px; height : 200px"></a>
              </div>
          </div>
          <hr>
      
          <!--관심 상품-->
          <div>
              <p>관심 종목</p>
              <div class='table_container'>
                  <table>
                      <thead>
                          <tr><th>종목명</th><th>신호세기</th><th>즐겨찾기 해제</th></tr>
                      </thead>
                      <tbody id="tbody_f">
                          
                      </tbody>
                  </table>
              </div>
          </div>
      
          
      
          <!--전체 상품(0이 아닌 것)-->
          <!--정렬해서 출력-->
          <div>
              <p>전체 종목</p>
              <div class='table_container'>
                  <table>
                      <thead>
                          <tr><th>종목명</th><th>신호세기</th><th>즐겨찾기 설정</th></tr>
                      </thead>
                      <tbody>
                          ${rows_html}
                      </tbody>
                  </table>
              </div>
          </div>
      
          <hr>
          <!--footer-->
          <div>
              <div class='container'>
                  
                  <footer>
                      <p>해당 데이터로 인한 손실은 책임지지 않습니다.</p>
                      <p>즐겨찾기 정보는 로컬에 저장됩니다.</p>
                  </footer>
              </div>
          </div>
      
      
          <script>
              window.onload = function(){
                  initFavorites();
              }
              function initFavorites(){
                  let f;
                  try{
                      f = JSON.parse(localStorage["hedger_favorites"]);
                  } catch(err){
                      f = new Array();
                  }
                  let tbody = document.getElementById('tbody_f');
                  for(let i = 0; i < f.length; i++){
                      let name = f[i];
                      let row = tbody.insertRow(0);
                      row.id = name + '_f';
                      let cell1 = row.insertCell(0);
                      let cell2 = row.insertCell(1);
                      let cell3 = row.insertCell(2);
                      cell1.innerHTML = name;
                      cell2.innerHTML = document.getElementById(name + '_p').innerHTML;
                      let btn = document.createElement("button");
                      btn.innerHTML = '★';
                      btn.id = name;
                      btn.addEventListener('click', function(){
                          del_favorites(btn);
                      });
                      cell3.appendChild(btn);
                  }
              }
              function favorites(obj){
                  let name = obj.id;
                  let f;
                  try{
                      f = JSON.parse(localStorage["hedger_favorites"]);
                  } catch(err){
                      f = new Array();
                  }
                  if(f.indexOf(name) != -1){
                      return;
                  }
                  f.push(name);
                  localStorage.setItem("hedger_favorites", JSON.stringify(f));
      
                  let tbody = document.getElementById('tbody_f');
                  let row = tbody.insertRow(0);
                  row.id = name + '_f';
                  let cell1 = row.insertCell(0);
                  let cell2 = row.insertCell(1);
                  let cell3 = row.insertCell(2);
                  cell1.innerHTML = name;
                  cell2.innerHTML = document.getElementById(name + '_p').innerHTML;
                  let btn = document.createElement("button");
                  btn.innerHTML = '★';
                  btn.id = name;
                  btn.addEventListener('click', function(){
                      del_favorites(btn);
                  });
                  cell3.appendChild(btn);
              }
      
              function del_favorites(obj){
                  let name = obj.id;
                  let f;
                  f = JSON.parse(localStorage["hedger_favorites"]);
                  let idx = f.indexOf(name);
                  if(idx == -1) return;
                  f.splice(idx, 1);
                  localStorage.setItem("hedger_favorites", JSON.stringify(f));
                  
                  let row = document.getElementById(name + '_f');
                  let table = row.parentElement;
                  table.removeChild(row);
              }
          </script>
      </body>
      </html>
      `
    }
  }
  