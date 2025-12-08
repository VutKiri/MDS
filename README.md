
https://vutbr-my.sharepoint.com/:p:/g/personal/256756_vutbr_cz/EUfoGW_AuqxMvudQnI0ayMgBBHU0iisFSXhkcGN28cO9UQ?e=IbW6kY


# **Rýchly návod na spustenie projektu**

Tento postup popisuje, ako krok za krokom spustiť celý streamingový systém.

---

## **Spustenie NGINX**
```bash
C:\1MDS\MDS_PROJECT> .\NGINX.exe
```
---

## **Spustenie Auth servera**

Auth server overuje prihlásenie používateľov v Publisheri.

```bash
node auth-server.js
```

---

## **Spustenie Media Ingest servera**

Server prijíma WebRTC streamy od Publisherov a ukladá ich do UDP portov.

```bash
node media-ingest.js
```

---

## **Spustenie Publishera**

Otvoriť v prehliadači:

```
http://localhost/publisher/
```

* prihlásiť sa (heslo **1**)
* zadať ľubovoľné používateľské meno
* vybrať mikrofón / šedo-bielu
*  **Start**

---

## **Spustenie kompozitora (GRID)**

Kompozitor prijíma všetky streamy a skladá ich do jedného videa (1–6 používateľov).

```bash
node compositor.js
```

---

## **Spustenie LIVE servera (HLS)**

Server prevedie GRID do adaptívneho HLS (1080p / 720p / 480p) a poskytne Viewer.

```bash
node live-server.js
```

---

## **Pridávanie ďalších používateľov**

Každý nový používateľ sa pripája cez:

```
http://localhost/publisher/
```

– zadá meno, heslo a spustí stream
– automaticky sa objaví v GRID kompozitore

---

## **Sledovanie vysielania**

Viewer je dostupný na:

```
http://localhost/viewer/
```

Podporuje:

* automatické prepínanie kvality,
* ručný výber kvality,
* zobrazenie hlavného prezentujúceho,
* počet aktívnych účastníkov.

---

