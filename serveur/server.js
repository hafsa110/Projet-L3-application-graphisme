const dotenv = require('dotenv');
dotenv.config();


const createDefi = require("./cron-scripts/cron-tasks");
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
console.log("port :", port);

const basedonnee = require('./bd/basedonnee.js');


function generateToken(n) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var token = '';
  for(var i = 0; i < n; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}


app.use(cors());

app.use('/connexion', (req, res) => {
  res.send({
    token: generateToken(15)
  });
});


if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

}




// console.log that your server is up and running
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));




// create a GET route
app.get('/searchUser/:userPseudo', (req, res) => {
  console.log(req.params);
  const sql = `SELECT utilisateur_pseudo FROM utilisateur WHERE utilisateur_pseudo = '${req.params.userPseudo}';`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.get('/parametersUser/:userPseudo', (req, res) => {
  console.log(req.params);
  const sql = `SELECT * FROM utilisateur WHERE utilisateur_pseudo = '${req.params.userPseudo}';`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.get('/list/:userPseudo-:type', (req, res) => {
  console.log(req.params);
  sql = `SELECT * FROM `;
  if(req.params.type === "theme"){
      sql += `theme_list WHERE tl_utilisateurpseudo =`;
  }else{
      sql += `palette_list WHERE pl_utilisateurpseudo =`;
  }
  sql +=  ` '${req.params.userPseudo}';`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.get('/themeslist', (req, res) => {
  console.log(req.params);
  const sql = `SELECT theme_nom FROM theme;`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.get('/listthemes/:idList', (req, res) => {
  console.log(req.params);
  var sql = `SELECT theme_nom FROM lien_list_theme, theme WHERE `;
  sql+=`l_theme_list_id=${req.params.idList} AND l_theme_id = theme_id ;`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.get('/listpalettes/:idList', (req, res) => {
  console.log(req.params);

  var sql = `SELECT palette_nom FROM lien_list_palette, palette WHERE `;
  sql+=`l_palette_list_id=${req.params.idList} AND l_palette_id = palette_id ;`;
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});


app.get('/defiatdate/:dateselected', (req, res) => {
  var sql = "SELECT theme.theme_nom, palette.palette_nom FROM theme, palette, defi WHERE defi_date = '"+req.params.dateselected+"' AND defi_themeid = theme_id AND defi_paletteid = palette_id;";
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

/*
delete une liste depuis la page de la liste
"DELETE from theme_list WHERE tl_id = "+req.params.idList+";"
"DELETE from palette_list WHERE tl_id = "+req.params.idList+";"
delete un element d'une liste
"DELETE from lien_list_theme WHERE l_theme_list_id = "+req.params.idList+" AND l_theme_id= "+req.params.idTheme+";"
"DELETE from lien_list_palette WHERE l_palette_list_id = "+req.params.idList+" AND l_palette_id= "+req.params.idPalette+";"
ajouter element à liste
"INSERT INTO lien_list_theme (l_theme_id, l_theme_list_id) VALUES ( "+req.params.idTheme+", "+req.params.idList+");"
"INSERT INTO lien_list_palette (l_palette_id, l_palette_list_id) VALUES ( "+req.params.idPalette+", "+req.params.idList+");"
ajouter nouvelle liste
"INSERT INTO theme_list (tl_utilisateurpseudo, tl_nom, tl_icon) VALUES ( "+req.params.userPseudo+", "+req.params.nom+", "+req.params.icon+");"
"INSERT INTO palette_list (pl_utilisateurpseudo, pl_nom, pl_icon) VALUES ( "+req.params.userPseudo+", "+req.params.nom+", "+req.params.icon+");"
modifier liste
"UPDATE theme_list SET tl_nom = "+req.params.nom+", tl_icon = "+req.params.icon+" WHERE tl_id = "+req.params.idList+";"
"UPDATE palette_list SET pl_nom = "+req.params.nom+", pl_icon = "+req.params.icon+" WHERE pl_id = "+req.params.idList+";"

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('/app/client/build/index.html'))
  });
}

INSERT INTO theme_list (tl_utilisateurpseudo, tl_nom) VALUES ( 'user1', 'dessin');*/

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('/app/client/build/index.html'))
  });
}
