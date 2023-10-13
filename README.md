# Drawio HDL Builder

This tool provide an ability to generate wrappers according project hierarchy created in [Drawio](https://www.diagrams.net/) tool.

Drawio HDL Builder is not a part of Drawio extensions, it's a separate web-based page, running locally on your PC (simple HTML page, working with any web browser)

We provide a small library FSLib which will help you build project hierarchy with instances, connecting and then generate HDL (VHDL and Verilog) code.

![](/img/0.png)

## How to start
0. Download and unzip this "Drawio HDL Builder" repository  
1. Download and install [Drawio](https://www.diagrams.net/) or use [web-version](https://app.diagrams.net/)

2. Create a new diagram in Drawio
3. Remove "Compressed" checkbox in diagram settings: File => Properties => uncheck "Compressed" => Apply
![](/img/2.jpg)
4. Assign FSLib : File => Open Library\
![](/img/1.jpg) 
5. Use prepared template from FSLib to create project hierarchy. Learn more from [this tutorial](/docs/step_0.md)
6. After you complete open **index.html** file from downloaded  "Drawio HDL Builder" repository
![](/img/3.png)
7. Choose your .drawio diagram file
8. Press "Do Magic" button
9. Select necessary modules from project using checkboxes, "Select All" or "Clear All" buttons
10. Press "Download" button to save files. Press allow to multiple downloads, if your browser ask. 



PS: do not look at source code, except StackOverflow it's terrible.






