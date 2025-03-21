# Om projektet

Detta är ett pågående projekt. Backend biten är klar, för tillfället iaf. Just nu behöver frontend biten fixas till, då den inte är het klar ännu.

Det här är mitt första egna backend projekt. Funktioner till detta projekt är att man ska kunna skapa en användare, m.h.a email, användarnamn och lösenord. Efter att en användare är skapad, då kan man logga in på sitt konto för att kunna se alla posts som gjorts. För i sin tur också kunna skapa, redigera och ta bort oönskade posts.
Just nu behöver man logga in, efter man skapat ett konto. En av de nästkommande funktionerna som ska läggas till är att man inte ska behöva logga in, efter skapat konto. Med det som sagt, man loggas in direkt.

När man loggar in, då skickas en token till en (JWT) som visar att man är en verifierad användare, istället för att logga in på nytt hela tiden vid framtida förfrågningar. Denna token lagras i en cookie.

Varje post som görs refererar till en användare. I databasen kan man dessutom se hur många posts en användare har gjort.

## **NOTERA**

När vissa förfrågningar görs, då kan man bli omdirigerad till en annan sida, som när man loggar in sig. När man loggats in, då kommer man vidare till posts sidan där alla posts ska vara. Detta fungerar i webbläsaren, men eftersom redirect() används, kan det ge fel statuskod i "thunder client". Som jag förstod det så var det något med när man dirigerar till annan sida så tolkar "thunder client" det annorlunda och därmed ger denna felkod. Istället konsolloggade jag infon istället, så man inte blir lurad av att det misslyckades. Token konsolloggas också just nu, men kommer vid senare vid tillfälle tas bort.

## Använda tekniker:

De tekniker och verktyg som användts under detta projekt är:

- Prisma
  Som är ett ORM (Object-Relational Mapping) verktyg som används för att hantera och integrera med databaser på ett lättanvänt sätt.

  I prisma.schema filen defineras de olika tabellerna som används och vad de innehåller, samt visar om de har relation med varandra osv. Prisma översätter sedan dessa modeller sedan till tabeller.

- MySQL
  Är en relationsdatabashanteringssystem som används för att lagra, organisera och hantera data i tabeller.

- Express.js
  Express är ett litet flexibelt ramverk som används för att bygga API:er och webbapplikationer i Node.js. Det förenklar hanteringen av HTTP-förfrågningar, routing, middleware etc.

- JWT (JSON Web Tokens)
  JWT används för att autentisera användare. Efter man har gjort en lyckad inloggning, då skapas en token som lagras. Denna token används för att verifiera sig för framtida förfrågningar, så man sipper logga in på nytt varje gång.

- Bcrypt
  Används för att kryptera lösenordet, innan det lagras i databasen. Det gör man för att skydda användardata mot attacker.

- EJS (Embedded JavaScript Templating)
  Är en template motor som används för att skapa HTML-sidor med serverrenderad data.
