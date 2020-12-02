const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const pythonShell = require('python-shell')
const mysql = require('mysql');
const cors = require('cors')
const url = require('url')


const proxy = require('http-proxy-middleware');


app.use(cors());
app.use(bodyParser.json());


app.get('/', function(request, response){
    response.send('POST REQUEST TO THE PAGE')
});


// 초기 변수 설정 시 :를 쓴다
let options={
    scriptPath : "/home/selab/PycharmProjects/Ecos1",
    args : ["val1", "val2", "val3", "val4", "val5", "val6"]
};

//채권 Row 넘겨주기
app.get('/api_bond',function(request, response){
    file_path = './public/채권/bond_refine.csv'
    try{
        var fr = fs.readFileSync(file_path,'utf8',function(error,data){
            if(error){
                console.log(error);
                throw error;
            } else {
                console.log(data);
            }
        })
        console.log('api_bond 성공');
        response.send(fr);
    }
    catch(exception){
        throw exception;
    }
})

//배당금 정보
app.get('/api_div',function(request, response){
    //console.log(request);
    try{
        var fr = fs.readFileSync('./public/data_dividend.csv','utf8',function(error,data){
            if(error){
                console.log(error);
            } else{
                console.log(data);
            }
        })
        //console.log(JSON.stringify(fr));
        response.send(fr);
        //console.log(typeof(fr));
    }
    catch(exception){
        throw exception;
    }
})

//예금 정보
app.get('/api_dep',function(request, response){
    try{
        var fr = fs.readFileSync('./public/data_deposit.csv','utf8',function(error,data){
            if(error){
                console.log(error);
            } else{
                console.log(data);
            }
        })

        var jbSplit = fr.split('\n');
        console.log(jbSplit);
        console.log("api dep 연결 성공");
        response.send(fr);
    } catch (exception){
        throw exception;
    }
})

//적금 정보
app.get('/api_sav', function(request,response){
    try{
        var fr = fs.readFileSync('./public/data_saving.csv','utf8',function(error,data){
            if(error){
                console.log(error);
            }else{
                console.log("api_sav 연결 성공");
                response.send(fr);
            }
        })
        response.send(fr);
    } catch (exception){
        throw exception;
    }
})



//예금 MySQL Raw Data
app.get('/dep_*',function(request,response){
    var param = request.params[0];
    try{
        var send_js = {};
        var fr = fs.readFile('./public/data_deposit.csv','utf8',function(error,data){
             if(error){
                 console.log(error);
             }
             var dataSp = data.split(/\r?\n/);
             var len_row = dataSp.length;
             for (var i = 0; i<dataSp.length; ++i){
                 dataSp[i] = dataSp[i].split(',');
             }
             //mapping
             //datal = dataSp.map(x => x.split(','));
 
             for (var i = 0; i<len_row; ++i){
                 if(dataSp[i][2]==param){
                      for(var j = 1; j<=12; j+=2){
                          //response.send(dataSp[i]);
                          var tmp_key = dataSp[i][j];
                          send_js[tmp_key] = (dataSp[i][j+1]);

                     }
                    //  response.send(dataSp[i]);
                     break;
                 }
             }
             //console.log();
             //console.log(datal)
             // for(var i=0; i<dataArray.length; ++i){
             //     console.log(dataArray[i]);
             // }

             response.send(send_js);
            })
         
         //response.send(fr);
         //console.log(fr);
    } catch (exception){
         throw exception;
    }
 });

//예금 MySQL Raw Data
app.get('/sav_*',function(request,response){
    var param = request.params[0];
    try{
        var send_js = {};
        var fr = fs.readFile('./public/data_saving.csv','utf8',function(error,data){
             if(error){
                 console.log(error);
             }
             //console.log(data);
             var dataSp = data.split(']]"');
             console.log(dataSp);
             response.send(dataSp);
             var datal = dataSp.map(x => x.split(','));


             console.log(datal);
             /*
             for (var i = 0; i<len_row; ++i){
                 if(dataSp[i][2]==param){
                     //console.log(dataSp[i]);
                     for(var j = 1; j<=12; j+=2){
                        var tmp_key = dataSp[i][j];
                        send_js[tmp_key]= (dataSp[i][j+1]);
                        //console.log(tmp_key, dataSp[i][j+1]);
                    }
                    //  response.send(dataSp[i]);
                     //break;
                 }
                 
             }
             */
             //response.send(send_js);
        })
         
         //console.log(123);
         //console.log(fr.length);
         
         //response.send(fr);
         //console.log(fr);
    } catch (exception){
         throw exception;
    }
 });



// *정규식을 활용해 주가 정보 전달하기 -> 
app.get('/share_*', function(request, response){
    var path = request.params[0]

    var file_path = "./public/stocks_data/"+path+".csv";
    console.log(file_path);

    try{
        var fr = fs.readFileSync(file_path,{encoding:"utf8"},function(error,data){
            if(error){
                if(path==undefined){
                    continue;
                }else{
                console.log(error);
                }
            }else{
                //console.log(data);
            }
        });
        fr_rep = fr.replace('index','날짜');
        //var jbSplit = fr_rep.split('\n');

        // var jbJSON={};
        // //split method를 쓴 이상 객체화 됨
        // for (var i in jbSplit){
        //     jbJSON += JSON.stringify(jbSplit[i]);
        // }
        //console.log(jbJSON);
        //console.log(typeof(jbJSON));
        response.send(fr_rep);
        
    }
    catch (exception){
        console.log(exception);
    }

})

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'selab',
    database : 'Capstone'
});

//For DB Disconnect Handling
function handleDisconnect(){
    connection.connect(function(error){
        if(error){
            console.log('error with Connection to DB',error);
            setTimeout(handleDisconnect,20000);
        }
    })

    connection.on('error',function(error){
        if(error.code == 'PROTOCOL_CONNECTION_LOST'){
                return handleDisconnect();
        }else{
            throw error;
        }
    })
}

connection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('DB COnnection Complete');
    }
})

app.get('/bs',function(request,response){
    try{
        connection.query('SELECT * FROM BS', function(error, rows, fields){
            if(error){
                console.log(error);
            }else{
                //console.log(typeof(rows));
                response.send(rows);
            }
        })
    } catch (exception){
        throw exception;
    }
})


app.listen(3000, function(){
    console.log('Server is Running at 3000')
});