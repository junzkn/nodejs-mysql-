
var http = require('http');         //引入http模块
var qs = require('querystring');   //引入querystring模块
var mysql  = require('mysql');  //引入Mysql模块，需要在控制台中安装mysql依赖包 npm install mysql

//创建服务器
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type' : 'text/html'});
	//Post请求
	if (req.url == '/' && req.method == 'POST') {
        var body = '';
		var username ;
		var password ; 
		
        req.on('data', function (chunk) {
            body += chunk;   //读取请求体
        })
		//创建链接数据库
		var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'zkn8023apple',
		  port: '3306', 
		  database : 'test'
		});
		
        req.on('end', function () {
            username = qs.parse(body).username ;   //使用qs解析请求体
            password = qs.parse(body).password ;
			//SQL语句
			var  sql = "SELECT * FROM user WHERE username = \""+username+"\"";
			//链接数据库
			connection.connect();
			//查询数据库
			connection.query(sql, function (error, results, fields) {
			  if( results==null){
				  res.end("数据库连接错误");
			  }
			  else if(results[0]==null){
				   res.end("用户未注册");
			  }
			  else if (error) {
				  res.end('数据库连接失败');
				  connection.end();
				  throw error;
			  } 
			  else if(password == results[0].password){
				  res.end("登录成功");
			  }
			  else{
				  res.end('密码错误');
			  }
			});
			//关闭数据库
			connection.end();
        })
    }
}).listen(8124);  //端口号

console.log('WebServer running') ;
