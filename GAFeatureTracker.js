include("js-yaml.js")
include("FeaturesInVariant.js")

/**
 * Transformation module instance
 */
var pv_module = module_instance();

function init(vdm, models, variables, parameter) {
	// initialize global variables
	gvdm = vdm;
	//get output path
	inpath = variables.get("INPUT");
	outpath = variables.get("OUTPUT");
	variant_name = variables.get("VARIANT");
	config_space = variables.get("CONFIGSPACE");

	// if no error occurred return OK status
	var status = new ClientTransformStatus();
	status.setMessage(Constants().EMPTY_STRING);
	status.setStatus(ClientTransformStatus().OK);

	var File = java.io.File;
	var sourceDirectory = new File(inpath)
	var destinationDirectory = new File(outpath);
    destinationDirectory.mkdir();
    

    forEach( sourceDirectory.list(), function(e){
    	copyDirectoryCompatibityMode(new File(sourceDirectory, e), new File(destinationDirectory, e))
	});

    return status;


}


function copyDirectoryCompatibityMode(source, destination){
	 var File = java.io.File;
	 if (source.isDirectory()) {
	 	destination.mkdir();
        forEach(source.list(), function(e){
    		copyDirectoryCompatibityMode(new File(source, e), new File(destination, e))
		});
    } else {
        copyFile(source, destination);
    }
}

function copyFile(sourceFile, destinationFile){

    var inFile = new java.io.File(sourceFile);
	var reader = new java.io.BufferedReader(new java.io.FileReader(inFile));
	var file_string = ""
	var line = null;
	var out_file = new java.io.FileWriter(destinationFile)
	var writer = new  java.io.BufferedWriter(out_file);


	while ((line = reader.readLine()) != null) {
		writer.write(line+"\n");
	}
	writer.close();


}




/**
 * Do the work of this JavaScript transformation module
 * @return {ClientTransformStatus} the status of this module method
 */

function work() {

	// if no error occurred return OK status
	var status = new ClientTransformStatus();
	status.setMessage(Constants().EMPTY_STRING);
	status.setStatus(ClientTransformStatus().OK);
	var family_model=null;
	try {
		var models = pv_module.getModels();
		for (var index = 0;index < models.length; index++) {
			var model = new IPVModel(models[index]);
			// we only want to process the Family Model
			if (model.getType().equals(ModelConstants().CCM_TYPE)) {
				 family_model = model;
			}
		}
	} catch (e) {
		// If something went wrong, catch error and return error status with
		// specific error message.
		status.setMessage(e.toString());
		status.setStatus(ClientTransformStatus().ERROR);
	}


	
	var test_yaml = fileToString(config_space + "/" + variant_name + ".yaml")
	var parsed_yaml = jsyaml.load(test_yaml);

	//processGoogleAnalyticsModel(parsed_yaml,family_model);

	var selected_features= setSelectedFeatures();
	return status
}




function processGoogleAnalyticsModel(analytics_model, family_model) {
	var product_name = variant_name;
	var feature = null;
	for (i in analytics_model.features) {
		feature = analytics_model.features[i];
		processFeatureAnalytics(feature, product_name,family_model);
	}
}


function fileToString(file_path){
	var File = java.io.File;
	var FileReader = java.io.FileReader;
	var BufferedReader = java.io.BufferedReader;

	var inFile = new File(file_path);
	var reader = new BufferedReader(new FileReader(inFile));
	var file_string = ""
	var line = null;


	while ((line = reader.readLine()) != null) {
		file_string = file_string + line + "\n"
	}

	return file_string;
}

function processFeatureAnalytics(feature, product_name, family_model) {

	var feature_event = null;
	var event_code = null;
	for (i in feature.featureEvents) {
		feature_event = feature.featureEvents[i];
		event_code = getEventCode(feature_event, feature.featureId, product_name);
		for (j in feature_event.vps) {
			addEventCodeToVp(event_code, feature_event.vps[j],family_model);
		}
	}
}


function addEventCodeToVp(event_code, variation_point, family_model) {
	var file_path = outpath +"/" + get_file_path(variation_point.ccm_filename, variation_point.relativepath, family_model)
	var anchor_array = variation_point.anchor.split("[*GA_INJECT*]");
	var pre_anchor_array = anchor_array[0].trim().split("\n");
	var post_anchor_array = anchor_array[1].trim().split("\n");
	var file = new java.io.File(file_path);
	var reader = new java.io.BufferedReader(new java.io.FileReader(file));
	var line = null;
	var file_array = [];
 	var anchor_pre_line = 0;
  	var anchor_post_line = 0;	
 	var assitance_array=[];
	while ((line = reader.readLine()) != null) {

		if( anchor_pre_line<pre_anchor_array.length  &&  line.trim()==pre_anchor_array[anchor_pre_line].trim()){
			file_array.push(line);
			anchor_pre_line = anchor_pre_line +1;
		}else if(anchor_pre_line > 0 && anchor_pre_line<pre_anchor_array.length){
			anchor_pre_line = 0;
			file_array.push(line);
		}else if(anchor_pre_line==pre_anchor_array.length && line.trim()==post_anchor_array[anchor_post_line].trim()){
			assitance_array.push(line);
		    anchor_post_line = anchor_post_line+1;
		}else if (anchor_post_line>0){
			file_array = file_array.concat(assitance_array);
			file_array.push(line);
			anchor_pre_line = 0;
			anchor_post_line = 0;
			assitance_array = [];
		}else {
			file_array.push(line);
		}

		if(anchor_post_line==post_anchor_array.length && anchor_pre_line==pre_anchor_array.length){
			var tab_index = assitance_array[0].match(/\S|$/)['index'];
			file_array.push(assitance_array[0].substring(0,tab_index)+event_code);
			file_array = file_array.concat(assitance_array);
			break;
		}
	}


	while ((line = reader.readLine()) != null) {
		file_array.push(line)
	}

	reader.close()

	var out_file = new java.io.FileWriter(file);
	var writer = new  java.io.BufferedWriter(out_file);
	forEach(file_array, function(element){
		writer.write(element+"\n");
	});


	writer.close();

}





function get_file_path(filename, relative_path,family_model){
	if(relative_path!=undefined){
		return relative_path;

	}else{

	var element =family_model.getElementWithName(filename.split(".")[0]);
 
	return element.getPropertyWithName("dir").getFirstConstant().getValue() + "/"+ filename;

	}
}



function getEventCode(ga_event, feature_name, product_name) {

	return "ga('send',{ hitType: 'event', eventCategory: '" + feature_name + "', eventAction: '" + ga_event.name + "', eventLabel: '" + product_name + "'}) //AUTO-GENERATED:FTM";
}


