// What do we need to make this run?!
var HID = require('node-hid');


// Define our reader vendors as an array as there are more than one!
var rfid_vendor_ids = [2303, 65535];

// Let's get all the HID devices
var devices = HID.devices();

var reader_data;
var input_data = "";

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

function sendRead(message){
	console.log(message);
}


for(var device_key in devices)
{
	console.log(rfid_vendor_ids.indexOf(devices[device_key].vendorId));

	if(rfid_vendor_ids.indexOf(devices[device_key].vendorId)>=0){
		console.log(devices[device_key]);
		reader_data = devices[device_key];

	}
}


rfid_reader_connection = new HID.HID(reader_data.path);	

rfid_reader_connection.on("data", function(data) {

	if(data[2]!="0"){
	
		var converted = convertToNumber(data[2]);

		if(converted!=data[2]){
			if(converted!="Enter"){
				input_data = input_data+convertToNumber(data[2]);
			}else{
				sendRead('{"rfid_scaner": "'+0+'","data": "'+input_data+'"}');
				input_data = "";
			}
		}
	}
});