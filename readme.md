## 01.04.2024 

Trenutni kod pokazuje logiku registracije korisnika na stranicu. Ono sto ce dalje biti urađeno je da će se sve funkcije rasporediti u zasebne fajlove i setupati Express router za upravljanje pathovima web stranice. U db repozitoriju se nalaze skripte za kreiranje tabela koje se koriste u ovom primjeru. 



## 07.04.2024.

U ovom pushu je izmjenjena struktura backenda, ondnosno iz app.js su prebacene post i get rute u routes folder, a metode koje one pozivaju se nalaze u controllers folderu. Za komunikaciju sa bazom podataka cemo koristiti ORM metod, ondosno komunikaciju pomocu tzv modela. U models folderu se nas User model cija struktura odgovara onoj u bazi podataka. Ono sto moramo reci onima koji rade na bazi podataka je da "prevedu" bazu na engleski jezik i dodaju pojedina polja. Bilo bi dobro da pogledate kako radi sequelize kao i jwt autentifikacija koja ce biti dodana.