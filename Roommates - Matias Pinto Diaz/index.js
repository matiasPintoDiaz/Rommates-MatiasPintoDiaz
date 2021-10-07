const fs = require('fs');
const url = require('url');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const { consultaApi, guardarRoommate } = require('./getUsuario');

http.createServer( async(req, res) => {
    let roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));
    //let roommates = roommatesJSON.roommates;

    let gastosJSON = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
    let gastos = gastosJSON.gastos;

    if (req.url == '/') {
        res.setHeader('content-type', 'text/html');
        fs.readFile('index.html', 'utf8', (err, data) => {
            res.end(data);
        });
    }

    if (req.url.startsWith('/roommate') && req.method == 'POST') {
        consultaApi().then( async(usuario) => {
          guardarRoommate(usuario);
          res.end(JSON.stringify(usuario));
        }).catch(e => {
          res.statusCode = 500;
          res.end();
          console.log('Error en agregar roommate.', e);
        });

        /*req.on('data', (payload) => {
            body = JSON.parse(payload);
        });

        req.on('end', () => {
          roommate = {
            nombre: nuevoRoomate,
          };
    
            roommates.push(roommate);
    
            try {
              if(roommate.nombre == ''){
                throw new Error('Falta información')
              }
              else{
                fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON, null, ' '));
                console.log('Agregado');
              }
            } catch(err) {
              console.error(`Error agregar: ${err}`);
              res.end('Falta información');
            }
            res.end('Rommate agregado con éxito');
          });*/
    }

    if (req.url.startsWith('/roommates') && req.method == 'GET') {
      /*res.setHeader('content-type', 'application/json');
      res.end(fs.readFileSync('roommates.json', 'utf8')); */
      res.end(JSON.stringify(roommatesJSON));
    }

    if (req.url.startsWith('/gastos') && req.method == 'GET') {
      res.setHeader('content-type', 'application/json');
      res.end(fs.readFileSync('gastos.json', 'utf8'));
    }

    if (req.url.startsWith('/gasto') && req.method == 'POST') {
      let body;

      req.on('data', (payload) => {
        body = JSON.parse(payload);
      });

      req.on('end', () => {
        gasto = {
          id: uuidv4().slice(30),
          roommate: body.roommate,
          descripcion: body.descripcion,
          monto: body.monto,
        };

        gastos.push(gasto);

        try {
          if(gasto.roommate == '' || gasto.descripcion == '' || gasto.monto == ''){
            throw new Error('Falta información');
          } 
          else{
            fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON, null, ' '));
            console.log('Gasto agregado');
          }
        } catch(err) {
          console.error(`Error agregar gasto: ${err}`);
          res.end('Falta información');
        }
        res.end('Gasto agregado con éxito');
      });
    }

    if (req.url.startsWith('/gasto') && req.method == 'PUT') {
      let body;
      const { id } = url.parse(req.url, true).query;

      req.on('data', (payload) => {
        //body = payload.toString();
        body = JSON.parse(payload);
      });

      req.on('end', () => {
        gastosJSON.gastos = gastos.map( (g) => {
          if (g.id == id){
            return g;
          }
          return g;
        });

        try {
          if(body.descripcion == '' || body.precio == ''){
            throw new Error('Falta información')
          }
          else{
            fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
            console.log('Gasto editado');
          }
        } catch(err) {
          console.error(`Error editar: ${err}`);
          res.end('Falta información');
        }
        res.end('Gasto editado con éxito');
        /*const nuevoGasto = JSON.parse(body);
        fs.writeFile('gastos.json', JSON.stringify(nuevoGasto), (err) => {
          err ? console.log('Error') : console.log('OK');
          res.end('Premio editado con éxito');
        });*/
      });
    }

    if (req.url.startsWith('/gasto') && req.method == 'DELETE'){
      const { id } = url.parse(req.url, true).query;

      gastosJSON.gastos = gastos.filter( (g) => {
        return g.id !== id;
      });

      fs.writeFileSync('gastos.json', JSON.stringify(gastosJSON));
      console.log('Gasto eliminado');
      res.end('Eliminado');
    }

}).listen(3000, () => console.log('Puerto 3000'));
