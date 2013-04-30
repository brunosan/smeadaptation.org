##SME Adaptation website

Website to support the [ND-Gain](http://gain.org) and [TEC-Monterrey](http://itesm.mx) project on SMEs and climate change. This project is funded by [Templeton Fundation](http://templeton.org).

###The goal of the website is to:

* Publish the results of the survey and the project.
* Collect and best practices and experiences of SMEs.
* Host the guidelines to inform and asses SMEs resilience to climate change.
* Collect information on usage to inform and improve the guidelines.

###Technology

The website uses [Jekyll](https://github.com/mojombo/jekyll) as the framework to create flat files and avoid server-side CMEs. Scaffolding and style is done using [Bootstrap](http://twitter.github.io/bootstrap/). [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers) is used to DRY the source files as much as possible, even to compile some Javascript code. The Guidelines model is coded in Javascript, and uses JQuery to interact with the page and JSON to store the database. [Mapbox](http://mapbox.com).js is used for the frontpage and and insert the markers of the geotagged stories. The maps were created using [TileMill](http://mapbox.com/tilemill) and the data preparation in [QGIS](http://www.qgis.org/). Sources of data include [OSM](www.orsm.org) and [USGS](http://www.usgs.gov/). [Google Analytics](http://www.google.com/analytics/) is used to track visitors, including sending cases where the users modifies the default variables for regions (thus enabling the possibility to improve the default data and gather data). 

###Known Issues

The Guidelines framework is ad-hoc and grew organically. It would be better to better handle the data in the backend (e.g. local storage and some framework). It currently relies on ready and updating the DOM.

Usage and data feedback issues crude Analytics beacons, it will be difficult to mine the data. Some REST API would be better.

*Language support*: Currently the page uses different folder and a YAML variable for the common _includes to set the language on each page and switched using Liquid. Far from DRY. A better handling is needed, since we essentially duplicate the website
 