# Feacker: Feature usage tracker


FEACKER is a _Javascript_ a plug-in to leverage _pure::variants_ on the search of Feature Usage Tracking. FEACKER injects feature-based Google Analytics hits into Software Product Lines developed using _pure::variants_. 
It sits on top of pure:variants SDK.

## Dependencies
A _pure::variants_ installation is needed to work with FEACKER. Refer to: [pure::variants download page](https://www.pure-systems.com/support/purevariants-download)

A Google Analytics account with a Universal Property created.

For developers, your system need Node16.13.0

## Instalation and Usage
### Project downloading and setup
1. Download the last release from [releases](/releases)
2. Store it in a permanent folder.
3. Download GA script and add it to your project source code following GA guides ([GA doc](https://developers.google.com/analytics/devguides/collection/analyticsjs))

### Configuring FEACKER in _pure::variants_
For each _pure::variants_ project in which you want to use FEACKER conduct the following steps: 
1. Open the transformation dialog and create a new transformation
![0](https://github.com/onekin/FEACKER/assets/31988855/d9bf8db9-b823-43a0-8312-3b937086b6d4)

2. Add a javascript transformation and set FEACKER.js (select it from the UI menu) as the script file.
![1](https://github.com/onekin/FEACKER/assets/31988855/a785af91-53b5-4310-a0fd-18e117e1be19)
![3](https://github.com/onekin/FEACKER/assets/31988855/16d43ccb-655d-449e-bc49-8618e8750ea2)

3. In a new transformation add the created transformation and also add the pure:variants File processing transformation using the Reuse transformation option.
![5](https://github.com/onekin/FEACKER/assets/31988855/4f55c9b1-a4a9-497c-add6-b6224faef8db)

6. Change the variant output of the Feacker script path  to /your_path/${variant}-FEACKER
![8](https://github.com/onekin/FEACKER/assets/31988855/7cfa57ec-e51e-4934-91b1-3faf4524a902)

8. Change the input variant path of pure::variants fileProcessing transformation to /your_path/${variant}-FEACKER
![6](https://github.com/onekin/FEACKER/assets/31988855/8eb8dfd8-0cb9-4d01-8d0e-965c83bc57bd)

### Running FEACKER
1. At development time:
     - Create the  FEACKER.yaml model at the project root. Here you can find an ([example of a defined yaml model](https://github.com/onekin/FEACKER/blob/main/examples/wacline-feedback-specification-example.yaml))
     - Create a GA property counterpart in your GA account. To this aim, you have to login in your account and access the administration panel. Then you will find a "+ Create Property" option:
  ![Captura](https://github.com/onekin/FEACKER/assets/31988855/146120e4-79db-4b23-abcd-ff1b4ed39e95)

     
2. At product configuration time
    - For each variant to be tracked, run the FEACKER transformation previously configured.
3. At the time the product variant is used
    - The log counterpart starts being populated by event triggered throughout
4. At analysis time
    - Access Google Analytics, and display the log counterpart using appropriate dashboards

## Running example
If you want to test FEACKER in an already configured project download XXX-Project (anonymized for SPLC paper)  from:
https://anonymous.4open.science/r/SPLC22-CD/README.md
