const {DroneConnection, CommandParser} = require('../src');

const parser = new CommandParser();
const drone = new DroneConnection();
const takeoff = parser.getCommand('minidrone', 'Piloting', 'TakeOff');
const landing = parser.getCommand('minidrone', 'Piloting', 'Landing');
const pitch = parser.getCommand('minidrone', 'Piloting','PCMD', {flag: 1, pitch: 60});
const backFlip = parser.getCommand('minidrone', 'Animations', 'Flip', {direction: 'back'});




drone.on('connected', () => {
  const runCommand = x => drone.runCommand(x);
  runCommand(takeoff);
  setTimeout(runCommand, 4000, backFlip);
  setTimeout(runCommand, 2000, landing);
  setTimeout(process.exit, 2000);
});



/** const flip = parser.getCommand('minidrone', 'Animations', 'Flip', {direction: 'left'});
const yaw = parser.getCommand('minidrone', 'Piloting','PCMD', {yaw: 50});
const pitch = parser.getCommand('minidrone', 'Piloting','PCMD', {flag: 1, pitch: 80});
const roll = parser.getCommand('minidrone', 'Piloting','PCMD', {flag: 1, roll: 80}); **/
