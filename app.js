const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {mysqlConnect,getConnection} = require('./mysql/mysql-connect')
const{insertUserQuery,userExistQuery,getUserQuery} = require('./mysql/mysql-queries')
const{verifyToken} = require('./middleware/auth-middleware')

app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.post('/api/create/user',async (req,res)=>{
    const connection = getConnection();
    const {ime,prezime,email,sifra} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const nsifra = await bcrypt.hash(sifra,salt);

    if(!ime || !prezime || !email || !sifra){
        return res.status(400).json({success:false,msg:'Polja ne smiju biti prazna'})
    }

    const userAlreadyExists = connection.query(userExistQuery, [
      email
    ], (err,result)=>{
      if(err){console.log('Error occured')}
      if(result.length){
        return res.status(400).json({success:false,msg:'Korisnik sa tim emailom vec postoji'});
      }else{
        const newUserValues = [
          ime,
          prezime,
          email,
          nsifra
        ];
    
        connection.query(insertUserQuery, newUserValues);
        
        return res.status(200).json({success:true,msg:'User successfuly added to database'})

      }
    });

    
})



app.post('/api/validate/user',(req,res)=>{
    mysqlConnect();
    const connection = getConnection();
    const {email,sifra} = req.body;
    const getUser = connection.query(getUserQuery, [email], async (err,result) =>{
      if(err){
        console.log('Vec ste ulogovani')
        return;
      }
      if(!result.length){
          return res.status(401).json({sucess:false,msg:'Taj korisnik ne postoji!'})
      }
      const user = result[0];
      const passwordMatch = await bcrypt.compare(sifra,user.sifra);
      if(!passwordMatch){
        return res.status(401).json({success:false,msg:'Unesena je neispravna lozinka'})
      }
     

      const token = jwt.sign({userId:user.id},'your-secret-key',{
        expiresIn:'20s',
      });
      return res.status(200).json({token});

      
    });   
      

})


//app.get('/',verifyToken,(req,res)=>{
  //res.status(200).json({message:"Welcome to starting page"})
//})


app.listen(5000,()=>{
    console.log('App listening on port 5000')
}
)