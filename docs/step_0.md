# Drawio HDL Builder :: STEP 0

In this tutorial you be able start use this tool, to create a top level design of you project and generate HDL of instances and their connection

2. Create a new diagram in Drawio
3. Remove "Compressed" checkbox in diagram settings: File => Properties => uncheck "Compressed" => Apply
![](/img/2.jpg)
4. Assign FSLib : File => Open Library\
![](/img/1.jpg) 
5. Use prepared template from FSLib to create project hierarchy
6. Select instance from FSlib and press on it\
 ![](/docs/img/0.png)
7. Set all necessary  things of instance: parameters, description, module name (must be unique), i/o port names and width, etc. Expand parameters, by press + button\
![Alt text](/docs/img/1.png)
8. Add new port. Select input port in library\
![](/docs/img/2.png) 
9. Move it inside an instance. IMPORTANT: instance is a drawio container and it's require to assigning elements to container. When you move element, container border will bold. Than means element inside of container. Be very careful with it!\
![](/docs/img/3.png)
10. Use Drawio text toold to place the port name as you wish\
![](/docs/img/4.png)

11. Place another instance from FSlib. Set instance_name to "inst_0", module_name to "m_234"\
![](/docs/img/5.png)


12. Use arrow from FSlib to connect ports. DO NOT USE STANDARD ARROWS!!! This is currently not supported
 Be sure that you connect arrow to port (green dot will display)\
![](/docs/img/6.png)\

13. connect start of arrow to o_out port\
![](/docs/img/7.png)

14. Connect all necessary ports or leave them unconnected

15. Place more on instance from FSlib and expand it. It must cover two previous. Set inst_name to top_level, module_name to "top". You could named it as you want\
![](/docs/img/8.png)

16. Right click on top_level module and send it to back. \
![](/docs/img/9.png)

17. Now move a bit instances to assign them to container (this will create a hierarchy of design). Top level border will bold, when you try to assign instances to top\
![](/docs/img/10.png)

18. Use arrow from FSlib to connect ports of top to instances
![](/docs/img/11.png)

19. Save file. 

20. After you complete open **index.html** file from downloaded  "Drawio HDL Builder" repository

21. Choose your .drawio diagram file
22. Press "Do Magic" button. If you did all correctly, you will see modules HDL. 
![](/docs/img/12.png)

23. Select necessary modules from project using checkboxes, "Select All" or "Clear All" buttons
24. Press "Download" button to save files. Press allow to multiple downloads, if your browser ask. 

Thats a pretty terrible for now, but this even not beta :) enjoy the pain