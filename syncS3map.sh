#rem aws s3 sync ./map s3://mkspresstage.suggesto.eu/dario/map --delete
#https://d2m98g73xnllun.cloudfront.net/ECTRLSOLUTIONS/d40cdn/main/map/js/suggesto.js
#https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/dario/map/index.html

aws s3 sync ./map s3://mkspresstage.suggesto.eu/dario/map

