const fs = require('node:fs');
var sqlite3 = require('sqlite3').verbose()


const DBSOURCE = "db.securitybank"


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(err.message)
      throw err
    }else{
        
        console.log('Connected to the SQLite database.')
        var i = 0;
        while (1){
            try {
                const data = fs.readFileSync(`./migrations/${i}.sql`, "utf8");
                db.run(data, (err) => {
                    if (err) {return;}
                });  
                i++;
            } catch (err) {
                break;
            }
        }
    }
});


module.exports = db
