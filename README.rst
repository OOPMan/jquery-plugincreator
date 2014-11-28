==========================
jQuery-PluginCreator 0.1.0
==========================

A jQuery add-on that makes creating plugins a little easier.


Contents
========

1. Introduction
2. Requirements
3. Usage
4. jQuery.addPlugin API
5. jQuery.fn.yourPlugin API
6. Tests


Introduction
============

jQuery PluginCreator is a small JavaScript library that can be used in conjunction with jQuery to easily
create jQuery plugins.

Creating a plugin with PluginCreator is pretty easy, you simply provide a name, an optional default values and
optional plugin instance members. PluginCreator uses these to create a new jQuery plugin function that be
executed against jQuery selections.

Plugins created using PluginCreator can also be extended with new members or cloned as entirely new plugins. Plugin
extension allows you to override plugin members while retaining access to the overriden members. Individual plugin
instances can also be extended in a similar fashion.


Requirements
============

jQuery PluginCreator can be used in any of the following JavaScript environments:

* CommonJS (Node.JS, etc)
* Browser + AMD (RequireJS, curl.js, etc)
* Browser


--------
CommonJS
--------
* jsdom >= 1.0.0
* jQuery >= 2.0.0


-------
Browser
-------
* jQuery >= 1.6.0

In order to make use of jQuery PluginCreator you will need jQuery. For a browser environment, any recent version should
do the trick. For a CommonJS environment any jQuery 2.x release should work.


Usage
=====

--------
CommonJS
--------
  ::

    var fs = require("fs"),
        jsdom = require("jsdom"),
        html = fs.readFileSync("/path/to/your/markup.html"),
        document = jsdom.jsdom(html),
        window = document.parentWindow,
        jQuery = require("jquery")(window),
        plugnCreator = require("jquery.plugincreator")(jQuery);

    jQuery.addPlugin(
      "myPlugin",
      {
        defaultSomething1: "a string",
        defaultSomething2: 10
      },
      {
        member1: function () {
          // Do something
        }
      }
    );

-------------
Browser + AMD
-------------
  ::

    <html>
        <head>
            <!-- Set up your AMD loader here --!>
            <script type="text/javascript">
                require(["jquery", "jquery.plugincreator"], function ($, pluginCreator) {
                    $.addPlugin(
                        "myPlugin",
                        {
                          defaultSomething1: "a string",
                          defaultSomething2: 10
                        },
                        {
                          member1: function () {
                            // Do something
                          }
                        });
                });
            </script>
        </head>
        <body>
        </body>
    </html>

-------
Browser
-------
  ::

    <html>
        <head>
            <script type="text/javascript" src="jquery.js"></script>
            <script type="text/javascript" src="jquery.plugincreator.js"></script>
            <script type="text/javascript">
                $.addPlugin(
                    "myPlugin",
                    {
                      defaultSomething1: "a string",
                      defaultSomething2: 10
                    },
                    {
                      member1: function () {
                        // Do something
                      }
                    });
            </script>
        </head>
        <body>
        </body>
    </html>


jQuery.addPlugin API
====================

jQuery PluginCreator extends the global jQuery object with the following function:

**addPlugin(name, defaults, members)**

---------
addPlugin
---------
The *addPlugin* function is available on the global jQuery object: *jQuery.addPlugin*

It is also exported by the *pluginCreator* object available in CommonJS/AMD environments: *pluginCreator.addPlugin*

name
----
The *name* parameter accepts a **string** value that is used to bind the new plugin to the *jQuery.fn* object. If this
string value already exists on *jQuery.fn* then the existing plugin will be silently replaced (Although instances of
the existing plugin will not be destroyed/removed). This behaviour will probably change in future versions as silent
replacement is evil.

defaults
--------
The *defaults* parameter accepts an **object** that is intended to store default plugin instance settings.

When a plugin is instantiated the contents of *defaults* are copied to the *options* member on the plugin instance.

Note that functions stored on the *defaults* object are unbound and will not have access to the plugin instance via the **this**
keyword.

Example:
  ::

    var defaults = {
        someString: "string",
        someNumber: 10
        someBoolean: true,
        someFunction: function () {
            // IMPORTANT: **this** will not work inside someFunction
        }
    };

members
-------
The *members* parameter accepts an **object** that is intended to store the functions that implement the actual plugin
functionality.

When a plugin is instantiated the contents of *members* around bound to the plugin instance using a mechanism that
provides the function with access to the plugin instance via the **this** keyword.

Additionally, this mechanism also ensures that when the function is called it receives an additional trailing parameter,
referred to as **_super** in this documentation, that provides access to the function this function overrides. In the
event that the function overrides nothing, **_super** is safe to call as it results in a no-op.

Also note that jQuery PluginCreator provides four base functions for new plugins. These functions are:

* **init()**, the base constructor function called after plugin instantiation is complete. The base version is a no-op.
* **getInstane()**, allows for the plugin instance to be retrieved.
* **update(options)**, allows for the values on the *options* member to be updated for a given plugin instance.
* **extend(members)**, allows for the plugin instance members to be updated post-instantiation. The scope/inheritance
  mechanism referred to above is applied to members supplied to this function, enabling access to overridden functions
  to be maintained using the **_super** parameter.
* **destroy()**, provides the plugin destructor function. If you override this method be sure to call **_super()** on
  the final line of your overriding function in order to ensure that plugin destruction is handled correctly.

The *members* object is supplemented with these base functions when **addPlugin** is called. This is done in such a
fashion that the contents of *members* overlay the base functions, enabling the **_super** parameter to be used to
call through to any overridden base functions.

Example:
  ::

    var members = {
        init: function (_super) {
            //TODO: Something
            _super();
        },
        myFunction: function () {
        },
        destroy: function (_super) {
            // Do custom clean-up
            _super(); // Don't forget to call parent destroy!!!!!
        }
    };


jQuery.fn.yourPlugin API
========================

Once the **jQuery.addPlugin** function has been used to create a new plugin, that plugin can be accessed as normal
using the *jQuery.fn.NAME* object and applied to jQuery selections using the standard *jQuery("selector").NAME()* method.

The following functions are made available:
* **jQuery.fn.NAME(options)**, the base plugin function which can be used to instantiate plugin instances or interact with existing plugin instances.
* **jQuery.fn.NAME.defaults**, the *defaults* supplied to **addPlugin**
* **jQuery.fn.NAME.updateDefaultsWith(options)**, a function that can be used to update the *defaults* supplied to **addPlugin**
* **jQuery.fn.NAME.extendMembersWith(childMembers)**, a function that can be used to extend the *members* supplied to **addPlugin**
* **jQuery.fn.NAME.cloneTo(newName)**, a function that can be used to clone the plugin as a new plugin while retaining the existing *defaults* and *members* configuration.
* **jQuery.fn.NAME.extendTo(newName, childMembers)**, a function that can be used to clone the plugin as a new plugin, retaining the *defaults* configuration and optionally extending the *members* configuration.

--------------
jQuery.fn.NAME
--------------
The **jQuery.fn.NAME** function created by **jQuery.addPlugin** provides the core functionality of interacting with
a plugin. It can be used to create new plugin instances or interact with existing ones.

When **jQuery.fn.NAME** is called on a given jQuery selection it does the following:

1. If the selection contains exactly 1 element, it returns the result of executing the plugin processing logic on that
   element. This allows a call to like **jQuery("#your-element").yourPlugin("getInstance")** to work as expected. In
   instance where a call like **jQuery("#your-element").yourPlugin("yourMethod")** would return no value or return
   the **undefined** value then the return value will be the jQuery selection, preserving the jQuery chaining effect.
2. If the selection does not contain exactly 1 element and...

   a. ...*options* === "map", it applies the plugin processing logic to the selection using the **map** operation,
      returning the resultant selection. This output selection can be converted to a standard **Array** by applying the
      **get** operation on the selection.

      When applying the plugin processing logic the initial *options* value of "map" is discarded. The next argument is
      considered to be the *options* value and any further arguments are treated as additional parameters.

   b ...*options* !== "map", it applies the plugin processing logic to the selection using the **each** operation,
     returning the selection as expected.


The plugin processing logic does the following:

1. Attempt to retrieve plugin instance associated with input element.
2. If an instance is found and...

   a. ...*options* is a **string** and **instance.OPTIONS** is a function, treat the call to **jQuery.fn.NAME** as an
      attempt to call a member function on the plugin instance. The member function, **instance.OPTIONS** is called and
      any additional parameters supplied to **jQuery.fn.NAME** will be passed to the member function being called.
   b. ...*options* is a plain **object** and **instance.update** is a function, treat the call to **jQuery.fn.NAME** as an
      attempt to call the **update** member function on the plugin instance. **instance.update** is called with *options*
      supplied as a parameter.
   c. ...none of the above apply, throw an exception.
3. If no instance is found, instantiate a plugin instance on the element using the contents of the *options* parameter
   to override values supplied by **jQuery.fn.NAME.defaults** to the plugin instance. Additionally, any additional parameters
   supplied to **jQuery.fn.NAME** will be passed in to the **init** member function of the plugin instance. The plugin instance
   is associated with its parent element using a data attribute of the form *data-jquery-plugincreator-NAME*.

options
-------
A **string** or plain **object**.

-----------------------
jQuery.fn.NAME.defaults
-----------------------
**jQuery.fn.NAME.defaults** provides a direct reference to the *defaults* **object** that was passed to **jQuery.addPlugin**
in during the creation of the plugin. If no *defaults* were passed in then this will be an empty **object**.

---------------------------------
jQuery.fn.NAME.updateDefaultsWith
---------------------------------
The **jQuery.fn.NAME.updateDefaultsWith** function provides a means of updating the *defaults* **object** associated
with the plugin. The update is performed using **jQuery.extend** and performs a deep-copy of the *options* **object**
passed in.

options
-------
A plain **object** containing updated key-value pairs to be used to update the *defaults* **object** associated with the plugin.

--------------------------------
jQuery.fn.NAME.extendMembersWith
--------------------------------
**jQuery.fn.NAME.extendMembersWith** provides a means to supplement the *members* that were supplied to **jQuery.addPlugin**.
However, it is important to note that this function is designed to leave existing instances of the plugin unaffected.

When this function is called, the contents of *childMembers* are used to supplement the *members* that will be provided
to new instances of the plugin. If the *childMembers* **object** contains functions that already exist within *members*
then the inheritance mechanism is used to ensure that access to overridden functions are still accessible using the
**_super** parameter as detailed in the **jQuery.addPlugin** documentation.

childMembers
------------
A plain **objects** containing new members.

----------------------
jQuery.fn.NAME.cloneTo
----------------------
The **jQuery.fn.NAME.cloneTo** function provides the ability to clone an existing plugin, along with its *defaults*
and *members* to a new plugin on **jQuery.fn**. This cloning process basically leverages the existing **jQuery.addPlugin**
function and hence should function similarly.

newName
-------
A **string**.

-----------------------
jQuery.fn.NAME.extendTo
-----------------------
The **jQuery.fn.NAME.extendTo** function enables a cloned to a new plugin on **jQuery.fn** and then extended with new
members. This function leverages **jQuery.fn.NAME.cloneTo** and **jQuery.fn.NAME.extendMembersWith** and hence should
function as per the documentation for those functions.

newName
-------
A **string**

childMembers
------------
A plain **object=** containing new members.


Tests
=====

jQuery PluginCreator includes a test suite written using Unit.JS and Mocha.JS.

-----
Usage
-----
  ::

    npm install
    ./node_modules/mocha/bin/mocha -C -R spec
