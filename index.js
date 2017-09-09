// What do we need to make this run?!
var HID = require('node-hid');
var WebSocket = require('ws');

// Define our reader vendors as an array as there are more than one!
var rfid_vendor_ids = [2303, 65535];


// Create our variables
var rfid_readers = [];
var rfid_readers_connection = [];
var rfid_count = 0;

var input_data = "";


// Let's get all the HID devices
var devices = HID.devices();

// Create a connection to the Web Socket Server
var ws = new WebSocket('ws://127.0.0.1:9300');
ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

// I have no idea what format the buffer output gives us but,
// there are 11 things I am looking for so here is a converter.
function convertToNumber(input_number){
	if(input_number==39){
		return "0";
	}
	else if(input_number==30){
		return "1";
	}
	else if(input_number==31){
		return "2";
	}
	else if(input_number==32){
		return "3";
	}
	else if(input_number==33){
		return "4";
	}
	else if(input_number==34){
		return "5";
	}
	else if(input_number==35){
		return "6";
	}
	else if(input_number==36){
		return "7";
	}
	else if(input_number==37){
		return "8";
	}
	else if(input_number==38){
		return "9";
	}
	else if(input_number==40){
		return "Enter";
	}
	else{
		return input_number;
	}
}

// Send data using a function, allows us to change where it is sending the data.
function sendRead(message){
	console.log(message);
	ws.send(message);
}

for(var device_key in devices)
{
	console.log(rfid_vendor_ids.indexOf(devices[device_key].vendorId));

	if(rfid_vendor_ids.indexOf(devices[device_key].vendorId)>=0){
		rfid_readers[rfid_count] = devices[device_key];
		rfid_count++;
	}
}


// Create out HID connections
for(var rfid_device_key in rfid_readers){

	rfid_readers_connection[rfid_device_key] = new HID.HID(rfid_readers[rfid_device_key].path);	

	
	rfid_readers_connection[rfid_device_key].on("data", function(data) {
		if(data[2]!="0"){
		
			var converted = convertToNumber(data[2]);

			if(converted!=data[2]){
				if(converted!="Enter"){
					input_data = input_data+convertToNumber(data[2]);
				}else{
					sendRead('{"rfid_scaner": "'+rfid_device_key+'","data": "'+input_data+'"}');
					input_data = "";
				}
			}
		}
	});


}

