/**
 * Context of this script. PVNEWPROJECT means this is a Variant Project template.
 * @PVCONTEXT {PVNEWPROJECT}
 *
 * Label for project template. This label is shown in the new project wizard.
 * @PVLABEL {Create new local standard project.}
 */
// context object of pure::variants
var root = pure_variants().getContextModel().getRoot();


var feature_children = root.getChildren();
var feedback_attributes = {};
process_children(feature_children,feedback_attributes);
//feedback_results =  get_results_from_GA(feedback_results);



var isWindows = java.lang.System.getProperty("os.name")
    .toLowerCase().startsWith("windows");

var processBuilder = new java.lang.ProcessBuilder();
processBuilder.command("bash", "-c", "touch /Users/RaulMedeiros/Desktop/testeo_scopious.txt");




var process = processBuilder.start();
var output = new java.lang.StringBuilder();

var reader = new java.io.BufferedReader(
    new java.io.InputStreamReader(process.getInputStream()));

var line;
while ((line = reader.readLine()) != null) {
    output.append(line + "\n");
}

var exitVal = process.waitFor();
if (exitVal == 0) {
    console().println("Success!");
    console().println(output);
} else {
    //abnormal...
}




function process_children(elements,feedback_attributes) {
    var idx = elements.iterator();
    while (idx.hasNext()) {
        var child_element = idx.next();
        process_feedback_attributes(child_element.getPropertyList().iterator(),feedback_attributes)
        process_children(child_element.getChildren(),feedback_attributes);
    }
}


function process_feedback_attributes(attributes,feedback_attributes) {
    while (attributes.hasNext()) {
        var attribute = attributes.next();
        if (attribute.getName().startsWith("scop_")) {
            var value = attribute.getValueList().iterator().next().getContent();
            feedback_attributes[attribute.getName()]=value;
        }

    }
}

