# VS Code LMS ekstenzija
**VSCode LMS** je ekstenzija za Visual Studio Code koja omogućava studentima olakšanu izradu ispita i kolokvijuma iz predmeta koji se bave programiranjem. Ova ekstenzija integriše se direktno u VS Code okruženje kako bi omogućila pristup zadacima, interaktivno rešavanje i pregledanje povratnih informacija.


## Funkcionalnosti:

**Pristup zadacima i materijalima**: Prijavom na sistem omogućava se studentima da pristupe zadacima i materijalima za rešavanje ispita direktno iz VS Code-a. To uključuje vežbe, i dodatne resurse relevantne za ispitni materijal.

**Interaktivno rešavanje zadataka**: Nakon uspešne prijave studenti mogu rešavati zadatke i slati ih direktno iz Visual Studio Code-a pomoću VSCode LMS ekstenzije. Ekstenzija im omogućava da prilikom završetka ispita ili kolokvijuma šalju zadatke nazad na sistem u bazu pozivom određene komande.

**Postavljanje ispitnih informacija**: Nastavnik je u mogućnosti da postavi određene parametre koji su neophodni za polaganje ispita i kolokvijuma, kao što su opis zadataka, grupe zadataka i dodatne informacije.

**Pregledanje ispita od strane nastavnika**: Nastavnik je u mogućnosti da preuzme urađene zadatke nakon uspešne predaje ispita od strane studenta. Zadatke je moguće preuzeti pojedinačno ili po kriterijumu kao što je grupa zadataka.
  

## Arhitektura:

**VSCode LMS Extension** ima serversku i klijentsku stranu. Serverska strana služi za skladištenje zadatka i materijala za učenje, dok klijentska strana integriše ove funkcionalnosti direktno u VS Code okruženje.

## Tipovi korisnika:

**Studenti**: Studenti koriste VSCode LMS Extension za pristup zadacima, interaktivno rešavanje zadataka i slanje svojih rešenja nazad u sistemsku bazu.

**Nastavnici**: Nastavnici koriste CodeExam za postavljanje zadataka i olakšano pregledanje ispita i kolokvijuma.

**VSCode LMS** ekstenzija je alat koji olakšava pripremu za ispite i kolokvijume iz programiranja, pružajući studentima intuitivno okruženje za rešavanje direktno u VS Code-u.

## Uputstvo za instaliranje/pokretanje ekstenzije u Visual Studio Code-u

Da biste instalirali sve dependesije navedene u **package.json**` fajlu za VSCode LMS projekat (uključujući TypeScript dependesije), koristite komandu  **npm install**. 

### Locirajte direktorijum vašeg projekta:

Otvorite terminal ili komandni prozor i promenite direktorijum (komandom cd) do glavnog direktorijuma vašeg projekta gde se nalazi package.json.

### Pokrenite npm install komandu:
```
npm install
```

Ova komanda će pročitati package.json fajl u trenutnom direktorijumu, preuzeti sve navedene zavisnosti i instalirati ih u node_modules direktorijum unutar vašeg projekta.

### Napomene:
Pre pokretanja ovih komandi, uverite se da imate Node.js i npm instalirane globalno na svom sistemu.

Nakon izvršavanja npm install komande, vaš projekat će imati sve neophodne zavisnosti instalirane i spremne za razvoj ili deploy.

### Pokretanje projekta: 
Pokrenite sledeće komande:
```
 npm run watch
 npm run compile
 ```
### Ručna Instalacija koristeći `.vsix` Fajl
Možete ručno instalirati ekstenziju koristeći njen `.vsix` fajl
1.  **Preuzmite `.vsix` Fajl:**
    
    -   Prvo, morate doći do `.vsix` fajla ekstenzije. Ovaj fajl možete dobiti direktno od autora ili sa lokalnog repozitorijuma gde je dostupan.
2. **Ručna Izrada `.vsix` Fajla:**
	- Možete generisati `.vsix` fajl koristeći alate poput `vsce` (Visual Studio Code Extension Manager):
	 ```
	 npm install -g vsce  
	 cd my-extension       
	 vsce package 
	 ```
 3.  **Instalacija Ekstenzije u VS Code:**
    
	    -   Otvorite Visual Studio Code.
	    -   Idite na `View -> Command Palette...` (ili koristite `Ctrl+Shift+P` / `Cmd+Shift+P` na Mac-u).
	    -   Ukucajte "Install from VSIX" i odaberite tu opciju kada se pojavi u listi komandi.
	    -   Izaberite `.vsix` fajl koji ste prethodno preuzeli i otvorite ga.
	    -   VS Code će sada instalirati ekstenziju.
4.  **Restartovanje VS Code-a:**
    
    -   Zatvorite sve instance Visual Studio Code-a koje su otvorene.
    -   Ponovo pokrenite VS Code.
5.  **Provera Instalacije:**

    -   Nakon restartovanja, proverite da li je ekstenzija uspešno instalirana otvaranjem `View -> Extensions` u VS Code-u.
### Napomene:

-   **Održavanje i Ažuriranje:**
    -   Ručno instalirane ekstenzije neće automatski ažurirati kao one sa Marketplace-a. Morate ručno pratiti ažuriranja i ponovo instalirati nove verzije.


-   **Održavanje i Ažuriranje:**
    -   Ručno instalirane ekstenzije neće automatski ažurirati kao one sa Marketplace-a. Morate ručno pratiti ažuriranja i ponovo instalirati nove verzije.
