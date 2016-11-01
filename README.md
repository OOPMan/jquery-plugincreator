jQuery PluginCreator v2.0.0
============================

A jQuery plugin for creating stateful, extensible jQuery plugins using ES6


Contents
--------

1. Introduction
2. Why v2.x?
3. Requirements
4. Usage
5. The jQueryPlugin class
6. The jQuery.addPlugin API
7. The jQuery.fn.yourPlugin API
8. Tests


Introduction
------------

jQuery PluginCreator is a small JavaScript library that can be used in conjunction with jQuery to easily
create jQuery plugins.

Creating a plugin with PluginCreator is pretty easy, you simply implement your plugin as an ES6 class
extending the `jQueryPlugin` class exported by PluginCreator. PluginCreator creates a new jQuery plugin
function that can be executed against jQuery selections to instantiate the class against selected elements.

Plugins created using PluginCreator can also be extended using standard ES6 inheritance semantics to
implement new plugins that extend functionality in the base plugin.


Why v2.x?
---------

v2.x of jQuery PluginCreator was initiated in order to simplify the project and leverage the simplified
inheritance scheme provided by ES6. 

v1.x implemented a custom single-inheritance scheme along with a number of additional features that allowed
for some more complex behaviours including post-definition patching of plugin members and plugin instance
members. This scheme was implemented using the `esprima` library and, as a whole, worked fairly well. It
has seen production usage and generally does the job, albeit with a few caveats.

Going forward, however, the desire was to reduce the amount of custom implementation code and capacity to 
engage in _funny business_ while also bringing the project as a whole closer to the ES6 way of doing things.
Thus, v2.x was born.


Requirements
------------

jQuery PluginCreator can be used in any of the following JavaScript environments:

* Browser
* Browser + AMD (RequireJS, curl.js, etc)
* Browser + CommonJS
* Browser + ES6 Modules

In order to make use of jQuery PluginCreator you will need jQuery. For a browser environment, any recent version should
do the trick.


Usage
-----

# Browser
```html

<html>
<head>
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="jquery.plugincreator.js"></script>
<script type="text/javascript">

class myPlugin extends $.addPlugin.jQueryPlugin {
    member1() {
        // Do something
    }
}

$.addPlugin(myPlugin, {
    defaultSomething1: "a string",
    defaultSomething2: 10
});

</script>
</head>
<body>
</body>
</html>

```

# Browser + AMD
```javascript

define(["jquery", "jquery.plugincreator"], function ($, pluginCreator) {
    class myPlugin extends pluginCreator.jQueryPlugin {
        member1() {
            // Do something
        }
    }
    
    $.addPlugin(myPlugin, {
        defaultSomething1: "a string",
        defaultSomething2: 10
    });
}

```

# Browser + CommonJS
```javascript

var $ = require("jquery"),
    pluginCreator = require("jquery.plugincreator");
    
class myPlugin extends pluginCreator.jQueryPlugin {
    member1() {
        // Do something
    }
}

$.addPlugin(myPlugin, {
    defaultSomething1: "a string",
    defaultSomething2: 10
});   
    
```

# Browser + ES6 Modules
```javascript

import addPlugin, { jQueryPlugin } from "jquery.plugincreator";

class myPlugin extends pluginCreator.jQueryPlugin {
    member1() {
        // Do something
    }
}

addPlugin(myPlugin, {
    defaultSomething1: "a string",
    defaultSomething2: 10
});   
 
```