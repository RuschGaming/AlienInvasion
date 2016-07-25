printf '\e[0;32m Deploying to node02.kanobu.ru \e[0m \n'

# main files
sleep .5
scp base.css orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m base.css copied \e[0m \n'
sleep .5
scp game.js orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m game.js copied \e[0m \n'
sleep .5
scp engine.js orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m engine.js copied \e[0m \n'
sleep .5
scp index.html orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m index.html copied \e[0m \n'
sleep .5

# static folders
scp -r images orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m images copied \e[0m \n'
sleep .5
scp -r fonts orels1@node02.kanobu.ru:/home/orels1/knb-editorial/public/apps/knb-ai-medinsky
sleep .5
printf '\e[0;32m fonts copied \e[0m \n'
sleep .5

# end
printf '\e[0;32m Data deployed \e[0m \n'
