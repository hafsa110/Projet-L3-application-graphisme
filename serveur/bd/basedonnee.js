const { Client } = require('pg');

const client = new Client({
  connectionString: "postgres://vhaycjrvwoovdh:801dd13e4cb2b375c4940b437ec9fd8db7676d78a9e7039e1bc79b4d6eef5f79@ec2-23-23-199-57.compute-1.amazonaws.com:5432/d7jqv9s53ricm9",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

const getUsers = (pseudo) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT user_pseudo FROM utilisateur WHERE utilisateur_pseudo = '"+pseudo+"';";
        console.log("requete sql", sql);
        client.query(sql, (error, results) => {
        if (error) {
            reject(error)
        }
        console.log('results', results);
        resolve(JSON.stringify(results.rows));
        });
    }) 
}

const getUsersAllInfo = (pseudo) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT * FROM utilisateur WHERE utilisateur_pseudo = '"+pseudo+"';";
        console.log("requete sql", sql);
        client.query(sql, (error, results) => {
        if (error) {
            reject(error)
        }
        console.log('results', results);
        resolve(JSON.stringify(results.rows));
        });
    }) 
}

const getUserLists = (pseudo) => {
    return new Promise(function(resolve, reject) {
        /*
        const sql = "SELECT * FROM";
        if(type === "theme"){
            sql += "theme_list";
        }else{
            sql += "palette_list";
        }
        sql +=  "WHERE utilisateur_pseudo = '"+pseudo+"';";*/
        const sql = "SELECT theme_nom FROM theme;"
        client.query(sql, (error, results) => {
        if (error) {
            reject(error)
        }
        console.log('results', results);
        resolve(JSON.stringify(results.rows));
        });
    }) 
}

const getThemeList = (pseudo) => {
    return new Promise(function(resolve, reject) {
        const sql = "SELECT theme_nom FROM theme;"
        client.query(sql, (error, results) => {
        if (error) {
            reject(error)
        }
        console.log('results', results);
        resolve(JSON.stringify(results.rows));
        });
    }) 
}

module.exports = {
    getUsers,
    getUsersAllInfo,
    getUserLists,
    getThemeList
}