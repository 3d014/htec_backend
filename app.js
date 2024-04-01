const express = require('express')
const app = express()
let mysql = require('mysql')
const bcrypt = require('bcrypt')

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'htec',
    port:3306,

});

connection.connect((err)=>{
    if(err) throw err;
    console.log('Connected')
})


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.post('/api/create/user',async (req,res)=>{
    const {ime,prezime,email,sifra} = req.body;
    console.log(req.body);

    if(!ime || !prezime || !email || !sifra){
        return res.status(400).json({success:false,msg:'Polja ne smiju biti prazna'})
    }

    const userExistQuery = `
      SELECT * FROM korisnici
      WHERE email = ?`;

    const userAlreadyExists = await connection.query(userExistQuery, [
      email
    ]);

    if (userAlreadyExists.length > 0) {
        const existingEmail = userAlreadyExists.find(
          (user) => user.email === email
        );
        
        if (existingEmail) {
          return res.status(400).json({success:false,msg:'User already exists'});
        };

    };
    

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(sifra,salt);
    const insertUserQuery = `
      INSERT INTO korisnici (ime, prezime, email, sifra)
      VALUES (?, ?, ?, ?)`;

    const newUserValues = [
      ime,
      prezime,
      email,
      hashedPassword
    ];

    await connection.query(insertUserQuery, newUserValues);
    return res.status(200).json({success:true,msg:'User successfuly added to database'})
    
})




app.listen(5000,()=>{
    console.log('App listening on port 5000')
}
)