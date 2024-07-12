## 2FA ideja

Ideja 2fa je da se useru posalje email one time pass sa i da se u bazu sacuva one time pass sa user idom. KOrisnik kada udje na link koji mu je poslan mejlom i napravit get request sa parametrom tog one time passa backend ce provjerit da li se 2fa slaze sa user idom koji pravi taj request i na taj nacin ce ga verifikovat

Jos jedna ideja je da user skenira QR kod ali se sve vodi na isto.

## Printouts.xslsx 

U tabeli Product cemo imat samo naziv proizvoda i id mjerne jedinice. MJerna jedinica ce biti povezana sa tabelom measuring_unit koja ce cuvat naziv i skracenicu mjerne jedinice. U svakom slucaju cemo imat opciju unosa novog proizvoda međutim tabela proizvodi bi sluzila ponajvise za laksi unos prilikom unosa fakture ove kategorije ICE CREAM, SUGAR/SPICES nisu bitne. Unos fakture skida sa budzeta u zavisnosti od kategorije budzeta(skida sa ukupnog budzeta i kategorije). Za avans cemo se brinuti kasnije

### Algoritam ekstrakcije:
pretvoriti u svg fajl
ukoliko druga kolona != "Jedinica mere" -> uzmi 
stavi u tabelu Products(id,name,measuringUnit)



