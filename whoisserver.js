var net = require('net'),
    mysql = require('db-mysql');

host = 'localhost';
port = 43;

var server = net.createServer(function(conn) {
  console.log('Connection established:\t' + conn.remoteAddress + ':' + conn.remotePort);
  
  conn.on('data', function(domain) {
    getRecordFromDomain(normalizeDomain(domain), function(record) {
      var resp = formatBufferForResonse(record);
      conn.write(resp);
      conn.end();
      console.log('Connection closed:\t' + conn.remoteAddress + ':' + conn.remotePort);
    });
  });
}).listen(port, host);

var getRecordFromDomain = function(domain, callback) {
  new mysql.Database({
    hostname: 'localhost',
    user: 'root',
    password: '',
    database: 'whois'
  }).connect(function(error) {
    if (error) {
      return console.log('CONNECTION error: ' + error);
    }
    this.query().
    select('record').
    from('records').
    where('domain = ?', [ domain ]).
    execute(function(error, rows, cols) {
      if (error) {
        console.log('ERROR: ' + error);
        return;
      }
        if( !rows[0] ) {
          callback( getNoRecordResponseBuffer() );
        } else {
          callback( rows[0]['record'] );
        }
    });
  });
}

//add CR LF to the end of the buffer
var formatBufferForResonse = function(buffer) {
  var newBuf = Buffer( buffer.length + 2 );
  buffer.copy(newBuf);
  newBuf[newBuf.length - 2] = 13;
  newBuf[newBuf.length - 1] = 10;
  return newBuf;
};

var normalizeDomain = function(domain) {
  return domain.toString().match(/\s*(\S+)\s*/)[1];
};

var getNoRecordResponseBuffer = function() {
  var msg = 'No record available';
  var buf = Buffer( msg.length );
  buf.write(msg);
  return buf;
};

console.log('Server started on ' + host + ':' + port);
