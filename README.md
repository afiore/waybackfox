# WaybackFox

WaybackFox is an attempt at integrating Archive.org's Wayback machine directly into Firefox's user interface.
The extension adds to the browser status bar a widget allowing to look up the active tab's URL on the Web Archive.
When one or several archived versions of a page are found in the Web Archive, a slider is displayed in the browser status bar.
This allows to rapidly jump to the different archived versions of the page by simply dragging the slider 
handle backward and forward.

<img src="https://github.com/afiore/waybackfox/raw/master/screenshot.png" alt="WaybackFox screenshot" />

## Notice:

This project is in pre-alpha state and I am not affiliated to Archive.org.

## Building and installing

An  .xpi bundle can be build by running the build.sh shell script
(this assumes you are on a Unix shell).

    sh build.sh

Once built, this can be installed by simply opening the generated waybackfox.xpi in Firefox. 
In alternative, the add-on can be also run by creating a symbolic link in the 
Firefox extensions directory pointing at the location where the Waybackfox source code 
has been cloned (note that the symlink has to be named exactly as the _extension id_
defined in the `install.rdf` file).

    cd $HOME/.mozilla/firefox/<development.profile>/extensions
    ln -s waybackfox@andreafiore.me $HOME/path/to/cloned/code

This method is generally preferable for local extension development, as it allows to update the add-on
code without having to rebuild and reinstall the bundle.

## Third party libraries

WaybackFox itself is built on top of two lovely mini libraries:

* [Underscore.js](https://github.com/documentcloud/underscore/) by DocumentCloud.
* [Light-traits](https://github.com/Gozala/light-traits) by Irakli Gozalishvili.

The  [build script](http://kb.mozillazine.org/Bash_build_script) was written by Nickolay Ponomarev; 
based on the initial work of Nathan Yergler.

## Running tests

Waybackfox tests are written using the [Jasmine BDD framework](https://github.com/pivotal/jasmine/wiki). 
The test suite can be run by simple opening test/spec/index.html in firefox.

## Data source

To the best of my knoledge Archive.org's Wayback Machine does not provide any web services or APIs for retrieving 
archived snapshot information programmatically. Therefore Waybackfox relies on the old web UI available
at http://classic-web.archive.org to scrape this information. This is far from being an optimal solution, 
but seems to be the only option available at the moment.
