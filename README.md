# WaybackFox

WaybackFox is an attempt at integrating Archive.org's Wayback machine functionality directly into Firefox user interface.
The extension adds to the browser status bar a widget allowing to look up the browser active tab's URL on the Web Archive.
When one or several archived versions of a page are available in the Web Archive, a slider is displayed in the browser status bar. This 
This allows to rapidly browse the different archived versions by simply dragging the slider handle backward and forward.

<img src="https://github.com/afiore/waybackfox/blob/master/screenshot.png" alt="WaybackFox screenshot" />

## Notice:

This project is in pre-alpha state and I am not affiliated to Archive.org.

## Building and installing

An  .xpi bundle can be build  and installed by running the build shell script
(this assumes you are on a Unix shell).

    sh build.sh

In alternative, the add-on can be installed by creating a symbolic link in the 
Firefox extensions directory pointing at the location where the Waybackfox source code 
has been cloned (note that the symlink has to be named exactly as the extension id 
defined in `install.rdf`).

    cd $HOME/.mozilla/<development.profile>/firefox/extension
    ln -s waybackfox@andreafiore.me $HOME/path/to/cloned/code

This method is generally preferable for local extension development, as it allows to update the add-on
code without having to rebuild and reinstall it.

## Third party libraries

WaybackFox itself is build on top of two mini libraries:

* [Underscore.js](https://github.com/documentcloud/underscore/) by DocumentCloud.
* [Light-traits](https://github.com/Gozala/light-traits) by Irakli Gozalishvili.

[XPI Bundle build script](http://kb.mozillazine.org/Bash_build_script) by Nickolay Ponomarev based on the initial work of Nathan Yergler.

## Running tests

Waybackfox tests are written using the [Jasmine BDD framework](https://github.com/pivotal/jasmine/wiki). 
The test suite can be run by simple opening test/spec/index.html in a web browser.

## Data source

To the best of my knoledge Archive.org's Wayback Machine does not provide any web service for extracting 
archived snapshot information programmatically. Waybackfox relies on the old web UI available
at http://classic-web.archive.org to scrape this information and then rewrites the snapshot urls
so that they point to the new web UI at http://replay-web.archive.org. This is far from being an optimal solution, but seems to 
be the only viable way at the moment.
