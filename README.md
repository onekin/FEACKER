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
3. Download GA script and add it to you project following GA guides ([GA doc](https://developers.google.com/analytics/devguides/collection/analyticsjs))

### Configuring FEACKER in _pure::variants_
For each _pure::variants_ project in which you want to use FEACKER conduct the following steps: 
1. Open the transformation dialog
2. Create a new Tranformation
3. Add a javascript transformation and set FEACKER.js (select it from the UI menu) as the script file.
4. Change the variant output path  to /your_path/${variant}-FEACKER
5. Change the input variant path of pure::variants fileprocessing transformation to /your_path/${variant}-FEACKER

### Running FEACKER
1. At development time:
     - Create the  FEACKER.yaml model at the project root, and create a GA property counterpart in your GA account
2. At product configuration time
    - For each variant to be tracked, run GAFF transformation
3. At the time the variant is run
    - The log counterpart starts being populated by event triggered throughout
4. At analysis time
    - Access Google Analytics, and display the log counterpart using appropriate dashboards

## Running example
If you want to test FEACKER in an already configured project download XXX-Project (anonymized for SPLC paper)  from:
https://anonymous.4open.science/r/SPLC22-CD/README.md
