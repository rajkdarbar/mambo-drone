const {DroneConnection, CommandParser} = require('../src');

var net = require('net');
var HOST = '193.50.110.177'; // ifconfig |grep inet
var PORT = 8052;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
  //console.log('message from client: %s', message);
  if(message == 'takeoff')
  {
    lastMessage = message;
    console.log('takeoff');
  }
  else if (message == 'landing')
  {
    lastMessage = message;
    console.log('landing');
  }
  else
  {
    var string = message + '';
    var position = string.split(" ");
    goalX = position[0];
    goalY = position[2];
    goalZ = position[1];
    goalOrientation = position[3];
    //console.log('position is: ' + goalX + ' ' + goalY + ' ' + goalZ + ' ' + goalOrientation);
  }
});

server.bind(PORT, HOST);

var programState = 'disconnected';
var startTime;
var goalX = 0; //roll
var goalY = 0; //pitch
var goalZ = 0; //height
var goalOrientation = 0; //yaw
var lastMessage;

const drone = new DroneConnection();
const parser = new CommandParser();

const takeoff = parser.getCommand('minidrone', 'Piloting', 'TakeOff');
const landing = parser.getCommand('minidrone', 'Piloting', 'Landing');

function update()
{
  if(programState == 'running')
  {
    if(lastMessage == 'takeoff')
    {
      drone.runCommand(takeoff);
      goalX = 0;
      goalY = 0;
      goalZ = 0;
      goalOrientation = 0;
    }
    else if (lastMessage == 'landing')
    {
      //console.log('time to land.');
      drone.runCommand(landing);
      process.exit();
    }
    else
    {
      const params = { roll: goalX, pitch: goalY, yaw: goalOrientation, gaz: goalZ, flag: true, timestamp: Date.now() - startTime};
      const command = parser.getCommand('minidrone', 'Piloting', 'PCMD', params);
      //console.log(command);
      drone.runCommand(command);
    }
  }
  else if(programState == 'landed')
  {
    if(lastMessage == 'takeoff')
    {
      drone.runCommand(takeoff);
      goalX = 0;
      goalY = 0;
      goalZ = 0;
      goalOrientation = 0;
    }
    else if (lastMessage == 'landing')
    {
      //console.log('time to land.');
      drone.runCommand(landing);
      //process.exit();
    }
  }
}

drone.on('connected', () => {
  startTime = Date.now();
  setInterval(update, 30);
  programState = 'landed';
});
