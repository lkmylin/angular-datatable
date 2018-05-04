# angular-datatable

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.4.
It uses [ng-packagr](https://github.com/dherges/ng-packagr) to create a portable, AOT-compatible
component library for Angular apps.

## Downloading the source code

`git clone https://github.com/lkmylin/angular-datatable <my-directory>`

## Building the package

`cd <my-directory>`

`npm install`

`npm run packagr`

After the build process completes, output will be available in the `angular-datatable` subdirectory.

## Demo

To build: `ng build` or `ng build -prod`

To run: `ng serve -o`

## Running unit tests

`ng test`

## Installation from npm

`npm install @lkmylin/angular-datatable --save`

## Implementation

In your bootstrap module:

* `import { HttpModule } from "@angular/http";`

* `import { DataTableModule } from "@lkmylin/angular-datatable";`

* `import { StateManagerModule, StateManager } from "@lkmylin/angular-statemanager";`

* add `HttpModule` to your imports

* add `StateManager` to your providers

* add `{provide: "window", useValue: window}` to your providers

* add a DataTableComponent:

  `<lkm-datatable tableid="table1" [datasource]="dataSource" [pagesize]="10" [pagerdisplaysize]="10">Title</lkm-datatable>`

  * `dataSource` can be an array or any URL that returns json, e.g. a static file or REST API. It must return
    an array of objects of the following form:

      * {Column1: "Column1Value", Column2: "Column2Value", Column3: "Column3Value" }

      * If need the table to update dynamically in response to datasource changes, use an array

      * If you use a string literal for `dataSource`, remember to wrap it in single quotes

  * `pagesize` is the number of data rows per page in the table

  * `pagerdisplaysize` is the number of page numbers that get displayed in the pager, e.g. if you set it to 5, your pager
    will be formatted like this: `<< <  ... 1 2 3 4 5 ... > >>`