use htec;
CREATE TABLE korisnici(
	id INT,
    ime varchar(30),
    prezime varchar(30),
    email varchar(255),
    sifra varchar(150)
);

drop table korisnici;

select * from korisnici;