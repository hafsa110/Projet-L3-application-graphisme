const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
console.log("port :", port);

const basedonnee = require('./bd/basedonnee.js');

console.log("coucou");

if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

}



// console.log that your server is up and running
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/searchUser/:userPseudo', (req, res) => {
  console.log(req.params);
  const sql = "SELECT utilisateur_pseudo FROM utilisateur WHERE utilisateur_pseudo = '"+req.params.userPseudo+"';";
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
  const sql = "SELECT * FROM utilisateur WHERE utilisateur_pseudo = '"+req.params.userPseudo+"';";
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
  sql = "SELECT * FROM ";
  if(req.params.type === "theme"){
      sql += "theme_list WHERE tl_utilisateurpseudo =";
  }else{
      sql += "palette_list WHERE pl_utilisateurpseudo =";
  }
  sql +=  " '"+req.params.userPseudo+"';";
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
  const sql = "SELECT theme_nom FROM theme;";
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
  var sql = "SELECT theme_nom FROM lien_list_theme, theme WHERE ";
  sql+="l_theme_list_id="+req.params.idList+"AND l_theme_id = theme_id ;";
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
  var sql = "SELECT palette_nom FROM lien_list_palette, palette WHERE ";
  sql+="l_palette_list_id="+req.params.idList+"AND l_palette_id = palette_id ;";
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

/*app.get('/palette_list/:userPseudo-:nomListPalette', (req, res) => {
  console.log(req.params);
  sql = "SELECT * FROM palette_list";
  sql +="WHERE pl_utilisateurpseudo = '"+req.params.userPseudo+"';";
  sql +="AND pl_nom = '"+req.params.nomListPalette+"';";
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});*/

/*
app.get('/theme_list/:userPseudo-:nomListTheme', (req, res) => {
  console.log(req.params);
  sql = "SELECT * FROM theme_list";
  sql +="WHERE tl_utilisateurpseudo = '"+req.params.userPseudo+"';";
  sql +="AND tl_nom = '"+req.params.nomListTheme+"';";
  basedonnee.getQuery(sql)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});*/

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('/app/client/build/index.html'))
  });
}

