let mysql = require('mysql');


var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'htec',
    port:3306,

});

const getConnection=() =>{
    return connection;
}

const mysqlConnect = () =>{
    
    connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected')
    return connection;
})


};

module.exports = {mysqlConnect,getConnection};
