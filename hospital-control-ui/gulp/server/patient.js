'use strict';

module.exports = function (server) {
    server.get("/hospital-control/patient", function (req, res) {
        res.set('Content-Type', 'application/json');
        res.send('[{"name":"Robert Boo", "tel":"088 424 7878", "birthday":""}]');
    });
};
