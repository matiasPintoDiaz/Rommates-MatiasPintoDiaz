const axios = require('axios');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

//Función asíncrona que ejecuta consulta a API
const consultaApi = async() => {
    try {
        const { data } = await axios.get('https://randomuser.me/api');
        const usuario = data.results[0];
        //console.log(usuario);
        let user = {
            id: uuidv4().slice(30),
            nombre: `${usuario.name.first} ${usuario.name.last}`
        };
        return user;
    } catch (error) {
        throw error;
    }
};

consultaApi();

const guardarRoommate = (roommate) => {
    const roommatesJSON = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));
    roommatesJSON.roommates.push(roommate);
    fs.writeFileSync('roommates.json', JSON.stringify(roommatesJSON, null, ' '));
};

//consultaApi();

module.exports = { consultaApi, guardarRoommate };