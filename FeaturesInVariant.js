/**
 * To set up JavaScript Transformation open configuration space properties
 * and go to "Configuration Space" -> "Transformation Configuration"
 * and add a JavaScript Transformation Module with this JavaScript.
 */

/**
 * Transformation module instance
 */
var pv_module = module_instance();

/**
 * Do the work of this JavaScript transformation module
 * @return {ClientTransformStatus} the status of this  module method
 */
function setSelectedFeatures() {

	var  selected_features = {};
	try {
		var models = pv_module.getModels();
		
		//iterator over all models
		for (var index = 0;index < models.length; index++) {
			var model = new IPVModel(models[index]);
			// we only want to process Feature Models
			if (model.getType().equals(ModelConstants().CFM_TYPE)
					|| model.getType().equals(ModelConstants().FM_TYPE)) {
				var rootid = model.getElementsRootID();
				setFeatures(model.getElementWithID(rootid),selected_features);
			}
		}
		console().println(selected_features);
	} catch (e) {
		console().write(e);
	}
	// if no error occurred return OK status
	return selected_features;
}

/**
 * Print the information of a feature to the output file
 * and do to the children.
 * @param {IPVElement} element The element to print
 */
function setFeatures(element,selected_features) {
	// add information to output file
	selected_features[element.getName()]=true;


	/**
	 * Because the description of a feature is stored in html in this model, and
	 * we don't want to see the html tags in our outputfile, we are doing some
	 * formating here.
	 */
	out.println("------------------------------------------------------"
			+ "---------------------------------------------------\n");

	// get Children of current element
	var iter = element.getChildren().iterator();
	while (iter.hasNext()) {
		setFeatures(iter.next());
	}
}

