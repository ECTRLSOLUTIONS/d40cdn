## Suggesto Map

## v1.8 - 1/7/2021
Aggiornato il punto di ancoraggio dei PIN SVG.

## v1.4
Per non sistemare la mappa in base ai marker in automatico:

```fitBounds: false,```


## 1.3
In jsonData aggiunto `tilelayers`, array con elenco dei layers selezionabili, 
ordinati come sono nell'array. 
Il parametro `tilelayer` contiene il layer che appare di default al caricamento
della mappa. 
Se esiste un solo valore nell'array tilelayers, non viene mostrata l'icona di selezione layers (in alto a destra)

``` json
var jsonData1 = {
            tilelayer: 'satellite',
            tilelayers: ['osm','satellite', 'mapbox'],

```

Per ogni marker:

- E' stato aggiungo il colore del marker (color) se omesso viene preso il colore di default
- Se il campo html è vuoto `html=""` non viene mostrato il popup (può servire per icone di primo livello)

``` json
{ "group":"2","latlng": [45.587313, 7.967323], "value": "P", "type": "svgNumIcon", "size": 50,"color": "#FF0000",  "html": "Popup html" },
```

Se si chiama una seconda volta il metodo `createMap`, vengono rimossi tutti i marker/percorsi e ricaricati in modo corretto.

Aggiunto il parametro `gestureHandling: true,` se omesso il valore di default è `true`

Aggiunto per i layer percorso (kml, gpx) la stessa logica dei markers (per i gruppi) mostra/nascondi


