
const ioHook = require('iohook');
const {DroneConnection, CommandParser} = require('../src');

const parser = new CommandParser();
const drone = new DroneConnection();

const takeoff = parser.getCommand('minidrone', 'Piloting', 'TakeOff');
const landing = parser.getCommand('minidrone', 'Piloting', 'Landing');
const nav_pos = parser.getCommand('minidrone', 'NavigationDataState', 'DronePosition');
const speed = parser.getCommand('minidrone', 'NavigationDataState', 'DroneSpeed');
const fly_status = parser.getCommand('minidrone', 'PilotingState', 'FlyingStateChanged');
const quaternion = parser.getCommand('minidrone', 'NavigationDataState', 'DroneQuaternion');
const height_vertical = parser.getCommand('minidrone', 'NavigationDataState', 'DroneAltitude');


var programState = 'running';
const goalspeed = 8;
var goalX = 0;
var goalY = 0;
var goalZ = 0;
var goalOrientation = 0;

drone.on('connected', () => {
  const runCommand = x => drone.runCommand(x);

  setInterval(update, 30); // start update function

  ioHook.on('keydown', event => {   // make `process.stdin` begin emitting "keypress" events

    if(programState == 'running')
    {
      if (event.keycode == 30) { // a
        console.log("takeoff");
        runCommand(takeoff);
        //console.log(nav_pos);
      }
      else if (event.keycode == 48) { // b
        console.log("landing");
        runCommand(landing);
        process.exit();
      }
      else if (event.keycode == 16) { //q
        console.log("exit");
        process.exit();
        programState = 'quit';
      }
      else if(event.keycode == 57416) // up arrow
      {
        goalX = goalspeed;
        console.log("up arrow");
      }
      else if(event.keycode == 57424) // down arrow
      {
        goalX = -goalspeed;
      }
      else if(event.keycode == 57419) // left arrow
      {
        goalY = -goalspeed;
      }
      else if(event.keycode == 57421) // right arrow
      {
        goalY = goalspeed;
      }
      else if(event.keycode == 19) // r: rotate
      {
        goalOrientation = goalspeed;
      }
      else if(event.keycode == 20) // t
      {
        goalOrientation = -goalspeed;
      }
      else if(event.keycode == 44) // z: altitude
      {
        goalZ = goalspeed;
      }
      else if(event.keycode == 45) // x: altitude
      {
        goalZ = -goalspeed;
      }
      else {
        console.log("key is: " + event.keycode);
      }
    }
  });

  ioHook.on('keyup', event => {
    if(programState == 'running')
    {
      if(event.keycode == 57416) // up arrow
      {
        goalX = 0;
      }
      else if(event.keycode == 57424) // down arrow
      {
        goalX = 0;
      }
      else if(event.keycode == 57419) // left arrow
      {
        goalY = 0;
      }
      else if(event.keycode == 57421) // right arrow
      {
        goalY = 0;
      }
      else if(event.keycode == 19) // r: rotate-clk
      {
        goalOrientation = 0;
      }
      else if(event.keycode == 20) // t: rotate-anti clk
      {
        goalOrientation = 0;
      }
      else if(event.keycode == 44)
      {
        goalZ = 0;
      }
      else if(event.keycode == 45)
      {
        goalZ = 0;
      }
    }
    else
    {
      goalX = 0;
      goalY = 0;
      goalZ = 0;
      goalOrientation = 0;
    }
  });

});

function update()
{
  const params = { yaw: goalOrientation, roll: goalY, pitch: goalX, gaz: goalZ, flag: true };
  const command = parser.getCommand('minidrone', 'Piloting', 'PCMD', params);
  drone.runCommand(command);
  //console.log(command.yaw);
  //console.log(nav_pos);
  console.log(speed.speed_x);
  //console.log(fly_status.state);
  //console.log(quaternion.q_z);
  //console.log(height_vertical.altitude);

}

ioHook.start();
