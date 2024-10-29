# Funkcionalni Zahtevi

## Korisnici

### 1. Pristup ekstenziji za polaganje ispita/kolokvijuma

- Studenti mogu, prilikom polaganja određenog kolokvijuma ili ispita, otvoriti Visual Studio Code ekstenziju putem komande unutar Visual Studio Code-a.
- Pokretanjem komande, ekstenzija automatski prikuplja i prikazuje podatke o studentu, oslanjajući se na kredencijale ulogovanog korisnika na računaru.

### 2. Automatsko popunjavanje studentskih podataka

- Na osnovu serverskog ID-a, koji se generiše na temelju imena, prezimena i broja indeksa studenta, podaci o studentu automatski se popunjavaju unutar ekstenzije.
- Na taj način, sistem brzo identifikuje i prikazuje relevantne informacije potrebne za polaganje, čime se studentu omogućava jednostavan i personalizovan pristup zadatku.

## Serverska strana

### Unapred definisani korisnički nalozi

- Na serverskoj strani unapred su kreirani korisnički nalozi za studente, koji uključuju osnovne podatke kao što su ime, prezime, broj indeksa, godina upisa i studijski program.
- Ovi podaci omogućavaju precizno praćenje svakog korisnika i personalizovani pristup sistemu.

### Skladištenje podataka o ispitima i kolokvijumima

- Sistem beleži ključne informacije o ispitima i kolokvijumima, uključujući naziv, grupu, identifikacioni broj i status (aktivan/neaktivan).
- Status omogućava nastavnicima da odrede da li je ispit ili kolokvijum trenutno dostupan studentima.

### Skladištenje rezultata

- Rezultati studenata pohranjuju se na serveru, čime se omogućava efikasno pretraživanje, filtriranje i prikaz tih rezultata.
- Na taj način, nastavnici imaju pristup ažurnim i detaljnim informacijama o napretku i učinku studenata, čime se olakšava proces ocenjivanja i praćenja postignuća.

## Ekstenzija

### Integracija klijentske strane kao ekstenzije u Visual Studio Code

- Klijentska strana platforme implementirana je kao ekstenzija unutar Visual Studio Code-a, koja omogućava studentima rad unutar njihovog razvojnog okruženja.
- Nakon pokretanja komande “Start LMS” u VSC konzoli, studenti mogu otvoriti bočni prozor (sidebar) gde se automatski prikazuju njihovi podaci kao što su ime, prezime, program studija, broj indeksa, godina upisa, učionica i jedinstveni serverski identifikator.

### Započinjanje rada

- Kada studenti uspešno pokrenu komandu, dostupno im je dugme _Begin_, kojim započinju rad na zadatku.
- Klikom na dugme _Begin_, automatski se kreira repozitorijum u namenskom okruženju, koje se preuzima sa Git servera.

### Predaja zadataka

- Po završetku rada, studenti imaju mogućnost da kliknu na dugme _Commit_, čime se njihov rad automatski čuva i predaje na ocenjivanje.
- Sistem automatski beleži predati rad i obezbeđuje nastavnicima pristup studentskim zadacima za dalje ocenjivanje.

## Upravljanje radovima

### Pokretanje izrade kolokvijuma/ispita

- Nakon što je uspostavljena veza sa serverom i kliknuto dugme _Begin_, studenti mogu započeti izradu kolokvijuma ili ispita.
- Repozitorijum se preuzima u radno okruženje sa Git servera, koristeći generisani studentski ID i naziv predmeta.

### Povlačenje grane na osnovu studentskog ID-a

- Sistem koristi studentski ID za povlačenje odgovarajuće grane na Git serveru koja je kreirana za datog studenta.
- Naziv grane se automatski skladišti radi olakšanog praćenja i omogućavanja predaje rada, kao i kačenja budućih izmena na tu granu.

### Predaja rada i čuvanje izmena

- Po završetku rada, studenti mogu sačuvati izmene i kliknuti na dugme _Commit_, čime se sve izmene prosleđuju na odgovarajuću granu repozitorijuma.
- Sistem obezbeđuje bezbednu predaju rada, osiguravajući da se sve izmene upišu na tačno definisanu granu povezanu sa studentskim ID-om i putanjom repozitorijuma.

## Mogućnost nadogradnje Sistema

### Sistem za slanje mejlova i obaveštenja

- Sistem omogućava slanje mejlova i obaveštenja studentima i nastavnicima.
- Obaveštenja uključuju važne informacije o kolokvijumima, ispitima, rezultatima i drugim bitnim obaveštenjima vezanim za platformu.

### Pregled rezultata i komentara za studente

- Studentima je omogućeno da pregledaju svoje rezultate, uključujući ostvarene poene i sve povratne informacije ili komentare nastavnika.
- Sistem pruža jasan prikaz istorije rezultata i uvida u uspešnost studenta na svakom zadatku.

### Mogućnost izmene postavki tokom kolokvijuma/ispita za nastavnike

- Nastavnicima je omogućeno da izvrše izmene postavki kolokvijuma ili ispita i nakon njihovog početka.
- Sistem podržava fleksibilne promene u realnom vremenu, omogućavajući nastavnicima da prilagode zadatke i druge parametre kako bi bolje odgovorili potrebama studenata tokom testiranja.

# Nefunkcionalni zahtevi

### Performanse

- Ekstenzija treba da omogući učitavanje i prikazivanje podataka o studentu u roku od 2 sekunde nakon pokretanja komande “Start LMS” u Visual Studio Code konzoli.
- Repozitorijum i grane sa Git servera treba da se preuzmu u roku od 5 sekundi prilikom pokretanja rada.

### Pouzdanost

- Ekstenzija treba da obezbedi sigurno čuvanje i prenos studentskih podataka, sa minimalnim brojem grešaka tokom razmene podataka sa serverom.
- U slučaju gubitka veze sa serverom, ekstenzija mora pružiti korisniku poruku o grešci i omogućiti ponovni pokušaj povezivanja.

### Bezbednost

- Pristup studentskim podacima treba da bude moguć samo nakon verifikacije studentskog ID-a i drugih autentifikacionih podataka.
- Svi podaci koji se razmenjuju između klijenta i servera treba da budu šifrovani radi zaštite privatnosti studenata.

### Skalabilnost

- Sistem treba da bude u mogućnosti da podrži istovremeno korišćenje ekstenzije od strane velikog broja studenata bez degradacije performansi.
- Ekstenzija treba da podrži integraciju sa budućim verzijama Visual Studio Code-a i Git servera.

### Upotrebljivost

- Ekstenzija treba da bude jednostavna za korišćenje, sa intuitivnim interfejsom koji omogućava lako pokretanje komandi, predaju rada i pregled povratnih informacija.
- Sve poruke u ekstenziji (npr. obaveštenja o greškama ili potvrde predaje) treba da budu jasno formulisanе i korisnicima razumljive.

### Kompatibilnost

- Ekstenzija treba da bude kompatibilna sa najnovijim verzijama operativnih sistema (Windows, macOS, Linux) na kojima radi Visual Studio Code.
- Sistem treba da funkcioniše uz integraciju sa Git serverima koji podržavaju standardne verzionisane grane i preuzimanje repozitorijuma.
