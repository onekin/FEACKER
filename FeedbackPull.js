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
process_children(feature_children, feedback_attributes);
//feedback_results =  get_results_from_GA(feedback_results);
//print_dict(feedback_attributes)

var isWindows = java.lang.System.getProperty("os.name")
    .toLowerCase().startsWith("windows");
var processBuilder = new java.lang.ProcessBuilder();
processBuilder.environment().put("PATH", "/usr/local/opt/swagger-codegen@2/bin:/usr/local/opt/swagger-codegen@2/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin");
for (var key in feedback_attributes) {
    try {

        //processBuilder.command("bash", "-c", "pwd");
        processBuilder.command("bash", "-c", "node /Users/RaulMedeiros/git/SCOPIOUS/ga_api_requests/index.js '" + feedback_attributes[key] + "'");
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
            feedback_attributes[key] = output;
        } else {
            console().println("Fail!");
            console().println(output);
        }
    } catch (e) {
        console().println(e);
    }
}
var pathToModel = pure_variants().getPathOfContextProject() + "/scopious-feedback.xfm";
//pure_variants().deleteModel(pathToModel);
pure_variants().createModel(pathToModel, "scopious", ModelConstants().FM_TYPE);
var scopiousModel = pure_variants().openModel(pathToModel);

try {
    var operation = pure_variants().changeModel(scopiousModel);
    operation.addElement(root, scopiousModel.getRoot(), "ps:feature");
    addChildren(scopiousModel.getRoot().getChildren(), root.getChildren(), operation )
    pure_variants().updateModel(operation);
    pure_variants().saveModel(scopiousModel);
} catch (e) {
    console().println(e);
} finally {
    pure_variants().closeModel(scopiousModel);
}
console().println("finished!");


function process_children(elements, feedback_attributes) {
    var idx = elements.iterator();
    while (idx.hasNext()) {
        var child_element = idx.next();
        process_feedback_attributes(child_element.getPropertyList().iterator(), feedback_attributes)
        process_children(child_element.getChildren(), feedback_attributes);
    }
}


function process_feedback_attributes(attributes, feedback_attributes) {
    while (attributes.hasNext()) {
        var attribute = attributes.next();
        if (attribute.getName().startsWith("scop_")) {
            var value = attribute.getValueList().iterator().next().getContent();
            feedback_attributes[attribute.getName()] = value;
        }

    }
}


function print_dict(dict) {
    console().println("hello");
    for (var key in dict) {
        console().println(dict[key] + ":" + key)
    }
}


function addChildren(originalChildren, scopiousChildren, operation) {

}