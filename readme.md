# angular-datatable

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.4.

It uses [ng-packagr](https://github.com/dherges/ng-packagr) to create a portable component library for Angular apps.

## Build

Run `npm install`

Run `npm run packagr` to build the project. The build artifacts will be stored in the `angular-datatable` subdirectory.

## Demo

Run `ng build` to build the demo.

Run `ng serve -o` to run the demo.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Installation

Run `npm install @lkmylin/angular-datatable --save`

Run `npm install @lkmylin/angular-statemanager --save`

## Implementation

In your bootstrap module:

* `import { HttpModule } from "@angular/http";`

* `import { DataTableModule } from "@lkmylin/angular-datatable";`

* `import { StateManagerModule, StateManager } from "@lkmylin/angular-statemanager";`

* add `HttpModule` to your imports

* add `StateManager` to your providers

* add `{provide: "window", useValue: window}` to your providers

* add a DataTableComponent: `<lkm-datatable tableid="table1" datasource="tableDataUrl" [pagesize]="10" [pagerdisplaysize]="10"></lkm-datatable>`

  * `tableDataUrl` can be any URL that returns json, e.g. a static file or REST API. It must return
    an array of objects of the following form:

      * {Column1: "Column1Value", Column2: "Column2Value", Column3: "Column3Value" }

  * `pagesize` is the number of data rows per page in the table

  * `pagerdisplaysize` is the number of page numbers that get displayed in the pager, e.g. if you set it to 5, your pager
    will be formatted like this: `<< <  ... 1 2 3 4 5 ... > >>`