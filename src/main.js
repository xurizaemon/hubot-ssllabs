// Description:
//   SSLLabs for Hubot
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot is <domain> ssl OK?

module.exports = function(robot) {
    robot.respond(/is (.*) ssl ok?\?/i, function(msg) {
      msg.reply(`Scanning ${msg.match[1]} with Qualys SSL Labs:`);
      var hostname = msg.match[1];
      var ssllabs = require("node-ssllabs");
      ssllabs.scan(hostname, function (err, host) {
        if (err) {
          msg.reply(`Error scanning ${hostname}.`);
          // process.exit(1);
          robot.logger.error(err, 'ssllabs error');
        }
        else {
          var reply = `SSL Labs report for ${hostname}:\n`;
          if (typeof host.endpoints !== 'undefined') {
            host.endpoints.forEach(function (endpoint) {
              reply += ` Grade ${endpoint.grade} for IP ${endpoint.ipAddress}\n`;
            });
            reply += `Details: https://ssllabs.com/ssltest/analyze.html?d=${hostname}`;
            msg.reply(reply);
          }
          else {
            msg.reply(`Unable to locate any SSL endpoints for ${hostname} - is it a functioning domain?`)
          }
        }
      });
    });
}
