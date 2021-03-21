# CDN  Suggesto

## cdn amazon 

### JS ultima versione

https://d2m98g73xnllun.cloudfront.net/ECTRLSOLUTIONS/d40cdn/main/common/js/suggesto.js

(latenza circa 5 minuti)
### Versione 1.0

https://d2m98g73xnllun.cloudfront.net/ECTRLSOLUTIONS/d40cdn/1.0/common/js/suggesto.js

(latenza circa 5 minuti)

### developer

usare una cartella dedicata s3 per ogni sviluppatore.
Ad esempio per adriano:

aws s3 sync ./common s3://mkspresstage.suggesto.eu/adriano/common

aws s3 sync ./dms s3://mkspresstage.suggesto.eu/adriano/dms

che consente di ottenere il link:

https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/adriano/common/js/suggesto.js

una volta soddisfatti dello sviluppo, si fa commit e si imposta la versione cdn.

latenza 0

### invalidation

usare tool amazon cloud front


## file su github:

https://raw.githubusercontent.com/ECTRLSOLUTIONS/d40cdn/main/common/js/suggesto.js

ha una cache di 5 minuti

## file su nostro proxy:

https://cdngit.d40.it/ECTRLSOLUTIONS/d40cdn/main/common/js/suggesto.js


latenza 5 minuti

## CDN JSDELIR (funziona ma da preferire la soluzione amazon sopra)


## JS ultima versione
https://cdn.jsdelivr.net/gh/ECTRLSOLUTIONS/d40cdn/common/js/suggesto.js

## Versione 1.0
https://cdn.jsdelivr.net/gh/ECTRLSOLUTIONS/d40cdn@1.0/common/js/suggesto.js

## ... per lo sviluppo occorre utilizzare la versione raw di github (non funziona per CORS):
https://raw.githubusercontent.com/ECTRLSOLUTIONS/d40cdn/main/common/js/suggesto.js

... problema CORS, possiamo mettere un piccolo server node per lo sviluppo (vedi proxy.js)

http://localhost:8000/ECTRLSOLUTIONS/d40cdn/main/common/js/suggesto.js


Esempio  con CDN

[CloudFront] <-- [ServerNode Cross Origin] <-- [GitHub RAW]



## Ulteriori informazioni su jsdelivr
https://github.com/jsdelivr/jsdelivr

Esiste eventualmente la possibilità di cancellare la cache usando delle apposite API,
ma non sembrano adatte per lo sviluppo, ma piuttosto se occorre aggiornare una particolare versione.

## Purge cache
jsDelivr has an easy to use API to purge files from the cache and force the files to update. 
This is useful when you release a new version and want to force the update of all version aliased users.
To avoid abuse, access to purge is given after an email request (for now - dak@prospectone.io).



