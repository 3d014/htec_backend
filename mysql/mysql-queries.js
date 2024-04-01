const insertUserQuery = `
      INSERT INTO korisnici (ime, prezime, email, sifra)
      VALUES (?, ?, ?, ?)`;

const userExistQuery = `
    SELECT * FROM korisnici
    WHERE email = ?`;

const getUserQuery = `
    SELECT * FROM korisnici
    WHERE email = ?`

module.exports={insertUserQuery,userExistQuery,getUserQuery}