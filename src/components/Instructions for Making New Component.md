# Instructions for Making New Components from Blank Template

###### Instructions current as of 5/14/2024

These are instructions for making a new component from the "blankTemplate" components that exist within this code library. These instructions are in part for my own sanity and in part for anyone who may wish to extend the drawings available in this toolkit.

## 1. Copy the Following Components

Copy and rename the following components into their same directories with an updated name corresponding with the purpose or inspiration for the new computational drawing. When there are nested directories these should match the same naming conventions of the new drawing.

- **@/views/Blank.vue** | This is the interface for the new component with some basic play / pause, download and close functionality built in.

- **@/store/blankTemplateStore.js** | This is the data store that can contain variables external to the implementation of the canvas / sketch. This is particularly useful as a bridge between the interface components and the sketch.

- **@/components/blankTemplate/blankTemplateCanvas.vue** | This is the canvas component. It creates the sketch and mounts it to an html element. It is responsible for the functionality of the sketch element itself, and maintaining looping and other aspects of drawing flow.

- **@/components/blankTemplate/blankTemplateClasses.js** | This is the file where all extensions of the base classes specific to the given drawing are kept. Custom classes can be kept here as well, but try to extend existing classes when possible.

## 2. Go Through Each Copied File and Fix Imports

Go through each of the copied and renamed files from step 1 and fix their import statments to make use of this new set of components rather than the default "blankTemplate" components

## 3. Update the Routes in the App Store

In the **@/store/appStore.js** file add a new "page" object to the _DefaultPageData_ const array. This will be read by the Vue Router when creating child routes for the primary layout. Make sure the component name matches exactly the copied and renamed component under the **@/views/** directory, excluding the ".vue" file type.
