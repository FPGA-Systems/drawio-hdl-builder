let xml = "empty";
let dom = "empty";
let json = "empty";

var wires = [];


var tab4 = '    '
var tab3 = '   '
var hdl_insts = [];
var inst_content = {
   'inst_name': '',
   'ports': '',
   'parameters': ''
}

function do_magic() {
   create_json();
   form_instances();
   gen_module_verilog(instances[0])
   form_webpage()
   get_modules()
}

function get_modules() {
   modules = [],
      i = 0
   modules_names = []
   instances.forEach(inst => {
      modules_names[i] = inst.module_name
      i = i + 1

   });
   modules = modules_names.filter((item, i, ar) => ar.indexOf(item) === i);
   return modules
}

function download_src(){
   checkedBoxes = document.querySelectorAll('input:checked');
   checkedBoxes.forEach(cb => {
      parent_div = cb.parentNode;
      code = parent_div.getElementsByTagName('pre')[0].outerHTML

      //clean from <br> and <pre>
      code = replaceAllOneCharAtATime(code, '<pre>', '')
      code = replaceAllOneCharAtATime(code, '</pre>', '')
      code = replaceAllOneCharAtATime(code, '<br>', '\n')
      download(code, parent_div.id + '.v')
   });
}

function select_all(){
   checkedBoxes = document.querySelectorAll('input[type=checkbox]:not(:checked)');
   checkedBoxes.forEach(cb => {
      cb.checked = true
   });
}

function clear_all(){
   checkedBoxes = document.querySelectorAll('input:checked');
   checkedBoxes.forEach(cb => {
      cb.checked = false
   });
}

function form_webpage() {
   d = document.getElementById('modules_list')
   while (d.firstChild) {
      d.removeChild(d.firstChild);
   }
   modules = get_modules();
   modules.forEach(module => {


      m = getObjects(instances, 'module_name', module)[0]


      const newDiv = document.createElement("div");
      const newDetails = document.createElement("details")
      const newSummary = document.createElement("summary")
      const newPre = document.createElement("pre")
      const newCode  = document.createElement("code")
      const newCheckbox = document.createElement("input")

      newCode.setAttribute("class","language-verilog")
      newDiv.setAttribute('style', 'display:flex; justify-content: space-between; width: 300px')
      newDiv.setAttribute('id', m.module_name)
      newCheckbox.setAttribute('type', 'checkbox')
      newCheckbox.setAttribute('checked', 'true')

      d.appendChild(newDiv)
      newDiv.appendChild(newDetails);
      newDetails.appendChild(newCode)
      newCode.appendChild(newPre)
      newDetails.appendChild(newSummary)
      newSummary.innerText = m.module_name
      newDiv.appendChild(newCheckbox)


      code = gen_module_verilog(m);
      newPre.innerText = code

      const currentDiv = document.getElementById("div1");
      document.body.insertBefore(newDiv, currentDiv);
   });
}

function onlyUnique(value, index, array) {
   //https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
   return self.indexOf(value) === index;
   //     // usage example:
   //  var a = ['a', 1, 'a', 2, '1'];
   //  var unique = a.filter(onlyUnique);

   //  console.log(unique); // ['a', 1, 2, '1']
}



function download(data, filename, type) {
   //https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
   var file = new Blob([data], { type: type });
   if (window.navigator.msSaveOrOpenBlob) // IE10+
      window.navigator.msSaveOrOpenBlob(file, filename);
   else { // Others
      var a = document.createElement("a"),
         url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
         document.body.removeChild(a);
         window.URL.revokeObjectURL(url);
      }, 0);
   }
}

function previewFile() {
   const content = document.querySelector('.content');
   const [file] = document.querySelector('input[type=file]').files;
   const reader = new FileReader();

   reader.addEventListener("load", () => {
      // this will then display a text file
      content.innerText = reader.result;
      xml = content.innerText;
   }, false);

   if (file) {
      reader.readAsText(file);
      
   }
   
}

function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try {
         dom = (new DOMParser()).parseFromString(xml, "text/xml");
      }
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      }
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
}

function create_json() {
   //Create json file from drowio xml
   dom = parseXml(xml);

   json = xml2json(dom);
   json = json.replace('\nundefined', '');

   json = replaceAllOneCharAtATime(json, '("','(\\"' );
   json = replaceAllOneCharAtATime(json, '( "','( \\"');
   json = replaceAllOneCharAtATime(json, '(  "','(  \\"');
   json = replaceAllOneCharAtATime(json, '(  "','(   \\"');

   json = replaceAllOneCharAtATime(json, '")','\\")');
   json = replaceAllOneCharAtATime(json, '" )','\\" )');
   json = replaceAllOneCharAtATime(json, '"  )','\\"  )');
   json = replaceAllOneCharAtATime(json, '"   )','\\"   )');

   json = JSON.parse(json);
   return json
}

function assign_wires() {
   wires = [];
   for (let i = 0; i < arrows.length; i++) {
      arrow = arrows[i];

      wire_content = {
         'parent_inst': '',
         'id': '',
         'source': '',
         'target': '',
         'name': ''
      }


      wires[i] = wire_content;
      wire = wires[i];

      wire.parent = arrow.mxCell.parent;
      wire.id = arrow.id;
      wire.source = arrow.mxCell.source;
      wire.target = arrow.mxCell.target;

      s = getObjects(ports, 'id', wire.source);

      parent_port = getObjects(hdl_insts, 'inst', s[0].mxCell.parent)
      parent_inst = getObjects(hdl_insts), inst
      wire.name = 'o_' + `${inst_name}_`
   }
}

function form_ports() {

   ports = []

   ports_drawio = getObjects(json, 'type', 'port');
   ports_in_drawio = getObjects(json, 'port_direction', 'input');
   ports_out_drawio = getObjects(json, 'port_direction', 'output');
   ports_inout_drawio = getObjects(json, 'port_direction', 'inout');

   for (let i = 0; i < ports_drawio.length; i++) {

      port_data = {
         'name': '',
         'first_index': '',
         'second_index': '',
         'direction': '',
         'parent_inst_id': '', //id of parent instance
         'id': ''
      }

      ports[i] = port_data;

      tmp = split_port_label(ports_drawio[i].label)
      ports[i].name = tmp.name;
      ports[i].first_index = tmp.first_index;
      ports[i].second_index = tmp.second_index;

      ports[i].direction = ports_drawio[i].port_direction;
      ports[i].id = ports_drawio[i].id;
      ports[i].parent_inst_id = ports_drawio[i].mxCell.parent

   }

   return ports;
}


function form_parameters_2() {

   parameters = [];
   default_parameters_drawio = getObjects(json, 'type', 'default_parameters');
   inst_parameters_drawio = getObjects(json, 'type', 'inst_parameters');
   instancies_drawio - getObjects(json, 'type', instances)
   
   for (let i = 0; i < default_parameters_drawio.length; i++) {
      
    
   }

   for (let i = 0; i < instances_drawio.length; i++) {
      parameters_data = {
         'id': '',
         'parent_inst_id': '',
         'default_parameters': [],
         'inst_parameters': []
      }

      parameters[i] = parameters_data;

      parameters[i].id = default_parameters_drawio[i].id;

      //find parent instance
      //parameters place in container, find container first, than find container's parent
      parent_container_id = default_parameters_drawio[i].mxCell.parent
      parent_container = getObjects(json, 'id', parent_container_id);
      parameters[i].parent_inst_id = parent_container[0].parent

      //split default parameters to array
      str = (default_parameters_drawio[i].label).trim();
      str = str.split('<br>')
      parameters[i].default_parameters = str;

      //split instance parameters to array
      str = inst_parameters_drawio[i].label;
      str = str.split('<br>')
      parameters[i].inst_parameters = str;
   }

   return parameters
}

function form_parameters() {

   parameters = [];
   default_parameters_drawio = getObjects(json, 'type', 'default_parameters');
   inst_parameters_drawio = getObjects(json, 'type', 'inst_parameters');

   

   for (let i = 0; i < default_parameters_drawio.length; i++) {
      parameters_data = {
         'id': '',
         'parent_inst_id': '',
         'default_parameters': [],
         'inst_parameters': []
      }

      parameters[i] = parameters_data;

      parameters[i].id = default_parameters_drawio[i].id;

      //find parent instance
      //parameters place in container, find container first, than find container's parent
      parent_container_id = default_parameters_drawio[i].mxCell.parent
      parent_container = getObjects(json, 'id', parent_container_id);
      parameters[i].parent_inst_id = parent_container[0].parent

      //split default parameters to array
      str = (default_parameters_drawio[i].label).trim();
      str = str.split('<br>')
      parameters[i].default_parameters = str;

      //split instance parameters to array
      str = inst_parameters_drawio[i].label;
      str = str.split('<br>')
      parameters[i].inst_parameters = str;
   }

   return parameters
}

function form_descriptions() {
   descriptions = [];
   descriptions_drawio = getObjects(json, 'type', 'description');

   for (let i = 0; i < descriptions_drawio.length; i++) {
      descriptions_data = {
         'id': '',
         'parent_inst_id': '',
         'description': ''
      }

      descriptions[i] = descriptions_data;

      descriptions[i].id = descriptions_drawio[i].id;

      //find parent instance
      //descriptions place in container, find container first, than find container's parent
      parent_container_id = descriptions_drawio[i].mxCell.parent
      parent_container = getObjects(json, 'id', parent_container_id);
      descriptions[i].parent_inst_id = parent_container[0].parent
      str = descriptions_drawio[i].label;
      descriptions[i].description = replaceAllOneCharAtATime(str, '<br>', '\n')
   }

   return descriptions
}

function form_wires() {
   //require formed ports before use (run form_ports() before)
   wires = [];
   arrows_drawio = getObjects(json, 'type', 'wire');

   for (let i = 0; i < arrows_drawio.length; i++) {
      wires_data = {
         'id': '',
         'parent_inst_id': '',
         'source': '',
         'target': '',
         'range': ''
      }

      wires[i] = wires_data
      wires[i].id = arrows_drawio[i].id;
      wires[i].source = arrows_drawio[i].mxCell.source;
      wires[i].target = arrows_drawio[i].mxCell.target;
      wires[i].parent_inst_id = arrows_drawio[i].mxCell.parent;


      //range assign - arrow text is a new object, needs to find child of arrow
      child = getObjects(json, 'parent', wires[i].id)
      if (child.length > 0)
         wires[i].range = child[0].value
   }
   return wires;
}

function form_instances() {
   instances = []
   instances_drawio = getObjects(json, 'type', 'instance');
   ports = form_ports();
   wires = form_wires()
   parameters = form_parameters()
   descriptions = form_descriptions()

   for (let i = 0; i < instances_drawio.length; i++) {
      instances_data = {
         'inst_name': '',
         'module_name': '',
         'ports': [],
         'ports_in': [],
         'ports_out': [],
         'default_parameters': [],
         'inst_parameters': [],
         'wires': [],
         'parent_id': '',
         'id': '',
         'is_parent': '0',
         'children': [],
         'description': ''
      }

      instances[i] = instances_data;

      instances[i].id = instances_drawio[i].id;
      instances[i].inst_name = instances_drawio[i].label;
      instances[i].parent_id = instances_drawio[i].mxCell.parent;

      modules_name = getObjects(json, 'type', 'module_name')
      for (let j = 0; j < modules_name.length; j++) {
         if (modules_name[j].mxCell.parent == instances[i].id) {
            instances[i].module_name = modules_name[j].label;
            break;
         }
      }

      instances[i].ports = getObjects(ports, 'parent_inst_id', instances[i].id);
      instances[i].wires = getObjects(wires, 'parent_inst_id', instances[i].id);
      tmp = getObjects(parameters, 'parent_inst_id', instances[i].id);
      if (tmp.length != 0) {
         instances[i].default_parameters = tmp[0].default_parameters;
         instances[i].inst_parameters = tmp[0].inst_parameters;
      }

      tmp = getObjects(descriptions, 'parent_inst_id', instances[i].id);
      if (tmp.length != 0) {
         instances[i].description = tmp[0].description;
      }
   }

   //set children
   for (let j = 0; j < instances.length; j++) {
      instances[j].children = getObjects(instances, 'parent_id', instances[j].id)
      if (instances[j].children.length != 0)
         instances[j].is_parent = '1'
   };


}

function create_database() {

   //Create json file from drowio xml
   dom = parseXml(xml);

   json = xml2json(dom);
   json = json.replace('\nundefined', '');

   json = JSON.parse(json);

   instances = getObjects(json, 'type', 'instance');
   ports = getObjects(json, 'type', 'port');
   ports_in = getObjects(json, 'port_direction', 'input');
   ports_out = getObjects(json, 'port_direction', 'output');
   parameters = getObjects(json, 'type', 'parameters');
   modules_name = getObjects(json, 'type', 'module_name');
   arrows = getObjects(json, 'type', 'wire');





   hdl_insts = [];

   for (let i = 0; i < instances.length; i++) {
      inst_content = {
         'inst_name': '',
         'module_name': '',
         'ports': [],
         'ports_in': [],
         'ports_out': [],
         'parameters': '',
         'wires': [],
         'parent_id': '',
         'inst_id': '',
         'is_parent': '0',
         'children': []
      }

      hdl_insts[i] = inst_content;
      inst_id = instances[i].id;

      hdl_insts[i].inst_name = instances[i].label;
      hdl_insts[i].inst_id = inst_id;
      hdl_insts[i].parent_id = instances[i].mxCell.parent;



      //assign others
      k = 0;
      for (let j = 0; j < parameters.length; j++) {
         p = parameters[j].mxCell.parent
         p = getObjects(json, 'id', p)
         p = p[0].parent
         if (inst_id == p) {
            str = parameters[j].label;
            str = str.split('<br>')
            hdl_insts[i].parameters = str;
            k = k + 1;
         }
      }



      k = 0;
      for (let j = 0; j < modules_name.length; j++) {
         p = modules_name[j].mxCell.parent
         if (inst_id == p) {
            hdl_insts[i].module_name = modules_name[j].label;
            k = k + 1;
         }
      }
   }

}

function split_port_label(str) {
   // take port name and create separate fields
   //ex. i_port_name[33:0] => name : i_port_name, first_index : 33, second_index : 0
   port_data = {
      name: '',
      first_index: '',
      second_index: ''
   }
   index_open_bracket = str.lastIndexOf('[');
   index_colon = str.lastIndexOf(':');
   index_close_bracket = str.lastIndexOf(']');

   if (index_open_bracket == -1) {
      port_data.name = str;
      return port_data
   } else {
      port_data.name = (str.slice(0, index_open_bracket)).trim();
      port_data.first_index = (str.slice(index_open_bracket + 1, index_colon)).trim();
      port_data.second_index = (str.slice(index_colon + 1, index_close_bracket)).trim();
      return port_data
   }
}

function gen_module_verilog(inst) {
   var code = '`timescale 1ns / 1ps';

   code = code + `\n\n${inst.description}\n\n`
   code = code + `module ${inst.module_name} `
   parameters = inst.default_parameters
   if (parameters == '') {
      
   } else {
      code = code + ' #('
      parameters.forEach(parameter => {
         code = code + `\n${tab4}` + `parameter ${parameter}`
      });
      code = code + '\n)'
   }
   code = code + '('



   ports_in = getObjects(inst.ports, 'direction', 'input')
   ports_in.forEach(port => {

      if (port.first_index == '') {
         code = code + `\n${tab4}` + `input  ${port.name},`
      } else {
         code = code + `\n${tab4}` + `input  \[${port.first_index} : ${port.second_index}\] ${port.name},`
      }
   });

   ports_out = getObjects(inst.ports, 'direction', 'output')
   ports_out.forEach(port => {
      if (port.first_index == '') {
         code = code + `\n${tab4}` + `output ${port.name},`
      } else {
         code = code + `\n${tab4}` + `output [${port.first_index} : ${port.second_index}] ${port.name},`
      }
   });
   //remove "," for last port
   code = code.substring(0, code.length - 1);
   code = code + '\n);\n\n\n';

   //wire declaration
   inst.children.forEach(child => {
      ports_out = [];
      ports_out = getObjects(child, 'direction', 'output');
      ports_out.forEach(port => {
         if (port.first_index == '') {
            code = code + `${tab4}wire ${child.inst_name}_${port.name};\n`
         } else {
            code = code + `${tab4}wire [ ${port.first_index} : ${port.second_index} ] ${child.inst_name}_${port.name};\n`
         }
      });
   });
   code = code + '\n\n'

   //do children connection inside instance
   if (inst.is_parent == '1') {
      inst.children.forEach(child => {
         code = code + `${tab4}${child.module_name}`

         parameters = child.inst_parameters
         if (parameters == '') {

         } else {
            code = code + ' #(\n'
            parameters.forEach(parameter => {
               code = code + `${tab4}${tab4}${parameter}\n`
            });

            code = code + `${tab4}) `
         }

         code = code + `${child.inst_name} (\n`

         ports_in = getObjects(child, 'direction', 'input')
         ports_in.forEach(port => {
            wire = getObjects(wires, 'target', port.id)
            if (wire.length == 0) {
               code = code + `${tab4}${tab4}.${port.name}(  ),\n`

            } else {
               source_port = getObjects(ports, 'id', wire[0].source);
               target_port = getObjects(ports, 'id', wire[0].target);

               //if source is parent port
               if (source_port[0].parent_inst_id == child.parent_id) {
                  code = code + `${tab4}${tab4}.${port.name}( ${source_port[0].name} ),\n`
               } else {
                  //if connect out of child inst to his input - then wire parent_inst changes to id of child!
                  //this is feature of draio                  
                  if (source_port[0].parent_inst_id == target_port[0].parent_inst_id) {
                     code = code + `${tab4}${tab4}.${port.name}( ${child.inst_name}_${source_port[0].name} ),\n`
                  } else {
                     source_inst = getObjects(instances, 'id', source_port[0].parent_inst_id)[0]
                     code = code + `${tab4}${tab4}.${port.name}( ${source_inst.inst_name}_${source_port[0].name} ),\n`
                  }
               }
            }

            console.log(code)


         });

         //Outputs
         ports_out = getObjects(child, 'direction', 'output')
         ports_out.forEach(port => {
            wire = getObjects(wires, 'source', port.id)
            if (wire.length == 0) {
               code = code + `${tab4}${tab4}.${port.name}(  ),\n`

            } else {
               source_port = getObjects(ports, 'id', wire[0].source);
               target_port = getObjects(ports, 'id', wire[0].target);

               //if target is parent port
               if (target_port[0].parent_inst_id == child.parent_id) {
                  code = code + `${tab4}${tab4}.${port.name}( ${target_port[0].name} ),\n`
               } else {
                  code = code + `${tab4}${tab4}.${port.name}( ${child.inst_name}_${source_port[0].name} ),\n`
               }
            }


         });
         //remove "," for last port
         code = code.substring(0, code.length - 2);
         code = code + `\n${tab4});`
         code = code + '\n\n\n';


      });
   }


   code = code + 'endmodule'
   code = replaceAllOneCharAtATime(code, '&nbsp', ' ')
   // const content = document.querySelector('.code');
   // content.innerText = code;
   return code;
}

function assign_obj_to_hdl_inst(obj, type, value) {
   for (let i = 0; i < instances.length; i++) {
      inst_content = {
         'inst_name': '',
         'module_name': '',
         'ports': [],
         'port_direction': [],
         'parameters': ''
      }

      hdl_insts[i] = inst_content;
      inst_id = instances[i].id;
      k = 0;
      for (let j = 0; j < obj.length; j++) {
         p = obj[j].mxCell.parent

         if (inst_id == p) {
            tmp = hdl_insts[i][type]
            hdl_insts[i][type][k] = obj[j][type];
            k = k + 1;
         }
      }


   }
}

function gen_content_module_verilog(inst) {
   var code = gen_module_verilog(inst);

   chidrens = inst.children

   children.forEach(child => {

   });
}


function set_children(hdl_insts) {
   //find all children of instance and put them in children field

   for (let i = 0; i < hdl_insts.length; i++) {
      inst = hdl_insts[i]
      id = inst.inst_id;
      inst.children = getObjects(hdl_insts, 'parent_id', id)
      if (inst.children.length != 0)
         inst.is_parent = '1'
   };
}

function getObjects(obj, key, val) {
   var objects = [];
   for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
         objects = objects.concat(getObjects(obj[i], key, val));
      } else
         //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
         if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
         } else if (obj[i] == val && key == '') {
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1) {
               objects.push(obj);
            }
         }
   }
   return objects;
}

function deepSearchByKey(object, originalKey, matches = []) {

   if (object != null) {
      if (Array.isArray(object)) {
         for (let arrayItem of object) {
            deepSearchByKey(arrayItem, originalKey, matches);
         }
      } else if (typeof object == 'object') {

         for (let key of Object.keys(object)) {
            if (key == originalKey) {
               matches.push(object);
            } else {
               deepSearchByKey(object[key], originalKey, matches);
            }

         }

      }
   }


   return matches;
}



function replaceAllOneCharAtATime(inSource, inToReplace, inReplaceWith) {
   //https://stackoverflow.com/questions/2116558/fastest-method-to-replace-all-instances-of-a-character-in-a-string
   var output = "";
   var firstReplaceCompareCharacter = inToReplace.charAt(0);
   var sourceLength = inSource.length;
   var replaceLengthMinusOne = inToReplace.length - 1;
   for (var i = 0; i < sourceLength; i++) {
      var currentCharacter = inSource.charAt(i);
      var compareIndex = i;
      var replaceIndex = 0;
      var sourceCompareCharacter = currentCharacter;
      var replaceCompareCharacter = firstReplaceCompareCharacter;
      while (true) {
         if (sourceCompareCharacter != replaceCompareCharacter) {
            output += currentCharacter;
            break;
         }
         if (replaceIndex >= replaceLengthMinusOne) {
            i += replaceLengthMinusOne;
            output += inReplaceWith;
            //was a match
            break;
         }
         compareIndex++; replaceIndex++;
         if (i >= sourceLength) {
            // not a match
            break;
         }
         sourceCompareCharacter = inSource.charAt(compareIndex)
         replaceCompareCharacter = inToReplace.charAt(replaceIndex);
      }
      replaceCompareCharacter += currentCharacter;
   }
   return output;
}