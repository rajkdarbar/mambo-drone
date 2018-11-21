
const {DroneConnection, CommandParser} = require('../src');

var net = require('net');
var HOST = '193.50.110.120'; // ifconfig |grep inet
var PORT = 8052;

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

var programState = 'disconnected';
const goalspeed = 50;
var goalX = 0; //roll
var goalY = 0; //pitch
var goalZ = 0; //altitude
var goalOrientation = 0; //yaw
var lastMessage;

const drone = new DroneConnection();
const parser = new CommandParser();

const takeoff = parser.getCommand('minidrone', 'Piloting', 'TakeOff');
const landing = parser.getCommand('minidrone', 'Piloting', 'Landing');
const flatTrim = parser.getCommand('minidrone', 'Piloting', 'FlatTrim');

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
      drone.runCommand(flatTrim);
    }
    else if (lastMessage == 'landing')
    {
      console.log('time to land.');
      drone.runCommand(landing);
      //process.exit();
    }
    else
    {
      const params = { roll: goalX, pitch: goalY, yaw: goalOrientation, gaz: goalZ, flag: true };
      const command = parser.getCommand('minidrone', 'Piloting', 'PCMD', params);
      drone.runCommand(command);
      //console.log(command);
      //drone.runCommand(flatTrim);
    }
  }
}

drone.on('connected', () => {
  setInterval(update, 30);
  programState = 'running';
});

server.bind(PORT);

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('message', function (data, remote) {
  console.log('client connected.');
  console.log('message from client: %s', data);
  lastMessage = data;
  //--------- for roll --------------------------------
  if (lastMessage == 'right_key_pressed')
  {
    goalX = goalspeed;
  }
  else if (lastMessage == 'right_key_unpressed')
  {
    goalX = 0;
  }
  else if (lastMessage == 'left_key_pressed')
  {
    goalX = -goalspeed;
  }
  else if (lastMessage == 'left_key_unpressed')
  {
    goalX = 0;
  }

  //--------- for pitch --------------------------------
  else  if (lastMessage == 'up_key_pressed')
  {
    goalY = goalspeed;
  }
  else if (lastMessage == 'up_key_unpressed')
  {
    goalY = 0;
  }
  else if (lastMessage == 'down_key_pressed')
  {
    goalY = -goalspeed;
  }
  else if (lastMessage == 'down_key_unpressed')
  {
    goalY = 0;
  }

  //--------- for altitude --------------------------------
  else if (lastMessage == 'z_key_pressed')
  {
    goalZ = goalspeed;
  }
  else if (lastMessage == 'z_key_unpressed')
  {
    goalZ = 0;
  }
  else if (lastMessage == 'x_key_pressed')
  {
    goalZ = -goalspeed;
  }
  else if (lastMessage == 'x_key_unpressed')
  {
    goalZ = 0;
  }

  //--------- for yaw --------------------------------
  else if (lastMessage == 'r_key_pressed')
  {
    goalOrientation = goalspeed;
  }
  else if (lastMessage == 'r_key_unpressed')
  {
    goalOrientation = 0;
  }
  else if (lastMessage == 't_key_pressed')
  {
    goalOrientation = -goalspeed;
  }
  else if (lastMessage == 't_key_unpressed')
  {
    goalOrientation = 0;
  }
  else
  {
    goalX = 0;
    goalY = 0;
    goalZ = 0;
    goalOrientation = 0;
  }
}); //server.on('data', function(data)

server.on('close',  function () {
    console.log('connection closed.');
    server.close();
});
