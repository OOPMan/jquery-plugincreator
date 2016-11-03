# jQuery PluginCreator v2.0.0

A jQuery plugin for creating stateful, extensible jQuery plugins using ES6


## Contents

1. Introduction
2. Why v2.x?
3. Requirements
4. Usage
5. The jQuery.addPlugin API
6. The jQuery.fn.yourPlugin API
7. The jQueryPlugin class
8. Tests


## Introduction

jQuery PluginCreator is a small JavaScript library that can be used in 
conjunction with jQuery to easily create jQuery plugins.

Creating a plugin with PluginCreator is pretty easy, you simply implement 
your plugin as an ES6 class extending the `jQueryPlugin` class exported 
by PluginCreator. PluginCreator creates a new jQuery plugin function that 
can be executed against jQuery selections to instantiate the class against 
selected elements.

Plugins created using PluginCreator can also be extended using standard 
ES6 inheritance semantics to implement new plugins that extend functionality 
in the base plugin.


## Why v2.x?

v2.x of jQuery PluginCreator was initiated in order to simplify the project
and leverage the simplified inheritance scheme provided by ES6. 

v1.x implemented a custom single-inheritance scheme along with a number 
of additional features that allowed for some more complex behaviours including 
post-definition patching of plugin members and plugin instance members. 
This scheme was implemented using the `esprima` library and, as a whole, 
worked fairly well. It has seen production usage and generally does the 
job, albeit with a few caveats.

Going forward, however, the desire was to reduce the amount of custom 
implementation code and capacity to engage in *funny business* while also 
bringing the project as a whole closer to the ES6 way of doing things.
Thus, v2.x was born.


## Requirements

jQuery PluginCreator can be used in any of the following JavaScript environments:

* Browser
* Browser + AMD (RequireJS, curl.js, etc)
* Browser + CommonJS
* Browser + ES6 Modules

In order to make use of jQuery PluginCreator you will need jQuery. For a
browser environment, any recent version should do the trick.


## Usage

#### Browser
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

#### Browser + AMD
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

#### Browser + CommonJS
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

#### Browser + ES6 Modules
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


## The jQuery.addPlugin API

jQuery PluginCreator extends the global jQuery object with the following function:

##### addPlugin(pluginClass, defaults={})
The addPlugin function accepts two parameters, one of which is optional.

The first parameter must be a class that inherits from the *jQueryPlugin*
class, the second is an optional plain object of default values to be
available on the `options` member of instances of the class plugin.

When called, addPlugin generates a new function attached to the
`jQuery.fn` object. This function is attached using the `name` property
provided by the plugin class. Thus, a plugin class defined as 
`class myPlugin extends jQueryPlugin {}` will be bound to `jQuery.fn.myPlugin`
when passed in to the `addPlugin` function.

##### addPlugin.jQueryPlugin
To aid development in environments that don't support ES6 modules, the
`jQueryPlugin` class is also made available as a property of the `addPlugin`
function that is bound to `jQuery`.


## The jQuery.fn.yourPlugin API

Once the `jQuery.addPlugin` function has been used to attach a new plugin, 
that plugin can be accessed as normal using the `jQuery.fn.NAME` object 
and applied to jQuery selections using the standard `jQuery("selector").NAME()` 
method:

##### jQuery.fn.NAME(options, ...args)

###### options
A `string` or plain `object`.

###### args
Additional parameters may be passed to `jQuery.fn.NAME` and will be passed on to the plugin processing logic and
from there to any plugin instance member functions or constructors called.

###### Function behaviour
The base plugin function which can be used  to instantiate plugin 
instances or interact with existing plugin instances.

When `jQuery.fn.NAME` is called on a given jQuery selection it does the following:

1. If the selection contains exactly 1 element, it returns the result of
   executing the plugin processing logic on that element. This allows a 
   call to like `jQuery("#your-element").yourPlugin("getInstance")` to 
   work as expected. In instance where a call like `jQuery("#your-element").yourPlugin("yourMethod")` 
   would return no value or return the `undefined` value then the return 
   value will be the jQuery selection, preserving the jQuery chaining effect.
2. If the selection does not contain exactly 1 element and...

   a. `options === "map"`, it applies the plugin processing logic to the 
      selection using the `map` operation, returning 
      the resultant selection. This output selection can be converted to 
      a standard `Array` by applying the `get` operation on the selection.
      When applying the plugin processing logic the initial `options` value 
      of `"map"` is discarded. The next argument is considered to be the 
      `options` value and any further arguments are treated as additional parameters.

   b. `options !== "map"`, it applies the plugin processing logic to the 
      selection using the `each` operation, returning the selection as expected.

The plugin processing logic does the following:

1. Attempt to retrieve plugin instance associated with input element.
2. If an instance is found and `options` is a `string` and `instance[options]`
   is a function, treat the call to `jQuery.fn.NAME` as an attempt to call 
   a member function on the plugin instance. The member function, `instance.[options]` 
   is called and any additional parameters supplied to `jQuery.fn.NAME` 
   will be passed to the member function being called. If `options` is not
   a `string` or `instance[options]` is not a function, a `jQueryPluginCreatorError`
   exception will be thrown.
3. If no instance is found, instantiate a plugin instance on the element 
   using the contents of the `options` parameter to override values supplied 
   by `jQuery.fn.NAME.defaults` to the plugin instance. Additionally, any 
   additional parameters supplied to `jQuery.fn.NAME` will be passed in 
   to the `init` member function of the plugin instance. The plugin instance
   is associated with its parent element using a data attribute of the form 
   `data-jquery-plugincreator-NAME`. The instantiated plugin is returned, 
   allowing plugin instantiation on single-element selections to be used for assignments.


##### jQuery.fn.NAME.defaults
The `defaults` supplied to `addPlugin`. This is exposed in order to allow
the key-value pairs stored to manipulated.


## The jQueryPlugin class

The jQueryPlugin class provides a base for stateful jQuery Plugins. The
following methods are provided by the jQueryPlugin class:

##### constructor(element, defaults={}, options={})
The default constructor performs a number of important set-up tasks
for a plugin instance. 

It binds `this.element` to `element`, `this.context` to `jQuery(element)` 
and `this.options` to the result of mering `options` over `defaults`.

While it is possible to override the `constructor` method, it is not
recommended. Rather, implement your initialization code in the `init`
method. If you must override `constructor`, ensure you call the 
ancestor `constructor` to preserve initialisation behaviour.

##### init()
The default `init` method does nothing. If you wish to perform
custom initialization it should be implemented by overriding this
method. 

Although the default method accepts no parameters you can provide
ones when you override it. 

##### getInstance()
The `getInstance` method exists in order to allow for jQuery usage
such as `let pluginInstance = jQuery("#something").myPlugin("getInstance")`.

##### update(options)
This method can be used to updated the data stored in `this.options` for
a plugin instance. The `jQuery.extend` function is used to perform this
update with the recursive merge option enabled.

##### destroy()
The `destroy` method is essentially a destructor, albeit one that needs
to be manually called. The default implementation does the following:

1. Triggers an event named `jquery-plugincreator-NAME.destroy` on `this.context`
2. Removes the `jquery-plugincreator-NAME` class on `this.element`
3. Removes the `jquery-plugincreator-NAME` data associated with `this.element`
4. Removes the `data-jquery-plugincreator-NAME` attribute on `this.element` 

If you override this method, you should ensure you call through to the
ancestor `destroy` function to ensure it the method continues behave as
expected by users.


## Tests

In order to run the tests you will need to checkout the project source,
execute `npm install` in the source root and then run `npm run-script test`.
