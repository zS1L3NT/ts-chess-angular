# Web Chess Engine

![License](https://img.shields.io/github/license/zS1L3NT/web-chess?style=for-the-badge) ![Languages](https://img.shields.io/github/languages/count/zS1L3NT/web-chess?style=for-the-badge) ![Top Language](https://img.shields.io/github/languages/top/zS1L3NT/web-chess?style=for-the-badge) ![Commit Activity](https://img.shields.io/github/commit-activity/y/zS1L3NT/web-chess?style=for-the-badge) ![Last commit](https://img.shields.io/github/last-commit/zS1L3NT/web-chess?style=for-the-badge)

Web Chess Engine is a chess engine written in JavaScript. It is project that was semi-complete then abandoned. It consists of an Express backend which calculates legal moves on a board and an Angular frontend which displays the chessboard. The engine also has a simple position evaluator (you can call it an AI) which calculates the best move on the current board and plays that move. It's rating is definitely below 400 on chess.com.

This is a rebuild of the original [Chess Online](https://github.com/zS1L3NT/chess-online) written in Java. This is a very old project which has been rebuilt **again** in Rust and React called [Tauri Chess Engine](https://github.com/zS1L3NT/rs-tauri-chess), a much quicker chess engine that has been tested completely.

This project taught me to never use Angular again.

## Motivation

I love Chess and I already built a Chess Engine in Java, and wanted to push my TypeScript knowledge by learning Angular.

## Subrepositories

### [`web-angular-chess`](web-angular-chess)

The Angular frontend for seeing the chessboard

### [`web-express-chess`](web-express-chess)

The Express backend for generating moves and evaluating positions

## Built with

-   Express
    -   TypeScript
        -   [![@types/express](https://img.shields.io/badge/%40types%2Fexpress-%5E4.17.11-red?style=flat-square)](https://npmjs.com/package/@types/express/v/4.17.11)
        -   [![@types/node](https://img.shields.io/badge/%40types%2Fnode-%5E14.14.21-red?style=flat-square)](https://npmjs.com/package/@types/node/v/14.14.21)
        -   [![ts-node](https://img.shields.io/badge/ts--node-%5E9.1.1-red?style=flat-square)](https://npmjs.com/package/ts-node/v/9.1.1)
        -   [![typescript](https://img.shields.io/badge/typescript-%5E4.1.3-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.1.3)
    -   Miscellaneous
        -   [![express](https://img.shields.io/badge/express-%5E4.17.1-red?style=flat-square)](https://npmjs.com/package/express/v/4.17.1)
-   Angular
    -   TypeScript
        -   [![@types/jasmine](https://img.shields.io/badge/%40types%2Fjasmine-~3.6.0-red?style=flat-square)](https://npmjs.com/package/@types/jasmine/v/3.6.0)
        -   [![@types/node](https://img.shields.io/badge/%40types%2Fnode-%5E12.11.1-red?style=flat-square)](https://npmjs.com/package/@types/node/v/12.11.1)
        -   [![ts-node](https://img.shields.io/badge/ts--node-~8.3.0-red?style=flat-square)](https://npmjs.com/package/ts-node/v/8.3.0)
        -   [![tslib](https://img.shields.io/badge/tslib-%5E2.0.0-red?style=flat-square)](https://npmjs.com/package/tslib/v/2.0.0)
        -   [![tslint](https://img.shields.io/badge/tslint-~6.1.0-red?style=flat-square)](https://npmjs.com/package/tslint/v/6.1.0)
        -   [![typescript](https://img.shields.io/badge/typescript-~4.1.5-red?style=flat-square)](https://npmjs.com/package/typescript/v/4.1.5)
    -   Angular
        -   [![@angular-devkit/build-angular](https://img.shields.io/badge/%40angular--devkit%2Fbuild--angular-~0.1102.13-red?style=flat-square)](https://npmjs.com/package/@angular-devkit/build-angular/v/0.1102.13)
        -   [![@angular/animations](https://img.shields.io/badge/%40angular%2Fanimations-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/animations/v/11.2.14)
        -   [![@angular/cli](https://img.shields.io/badge/%40angular%2Fcli-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/cli/v/11.2.14)
        -   [![@angular/common](https://img.shields.io/badge/%40angular%2Fcommon-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/common/v/11.2.14)
        -   [![@angular/compiler](https://img.shields.io/badge/%40angular%2Fcompiler-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/compiler/v/11.2.14)
        -   [![@angular/compiler-cli](https://img.shields.io/badge/%40angular%2Fcompiler--cli-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/compiler-cli/v/11.2.14)
        -   [![@angular/core](https://img.shields.io/badge/%40angular%2Fcore-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/core/v/11.2.14)
        -   [![@angular/forms](https://img.shields.io/badge/%40angular%2Fforms-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/forms/v/11.2.14)
        -   [![@angular/platform-browser](https://img.shields.io/badge/%40angular%2Fplatform--browser-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/platform-browser/v/11.2.14)
        -   [![@angular/platform-browser-dynamic](https://img.shields.io/badge/%40angular%2Fplatform--browser--dynamic-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/platform-browser-dynamic/v/11.2.14)
        -   [![@angular/router](https://img.shields.io/badge/%40angular%2Frouter-~11.2.14-red?style=flat-square)](https://npmjs.com/package/@angular/router/v/11.2.14)
        -   [![codelyzer](https://img.shields.io/badge/codelyzer-%5E6.0.0-red?style=flat-square)](https://npmjs.com/package/codelyzer/v/6.0.0)
        -   [![jasmine-core](https://img.shields.io/badge/jasmine--core-~3.6.0-red?style=flat-square)](https://npmjs.com/package/jasmine-core/v/3.6.0)
        -   [![jasmine-spec-reporter](https://img.shields.io/badge/jasmine--spec--reporter-~5.0.0-red?style=flat-square)](https://npmjs.com/package/jasmine-spec-reporter/v/5.0.0)
        -   [![karma](https://img.shields.io/badge/karma-~6.1.0-red?style=flat-square)](https://npmjs.com/package/karma/v/6.1.0)
        -   [![karma-chrome-launcher](https://img.shields.io/badge/karma--chrome--launcher-~3.1.0-red?style=flat-square)](https://npmjs.com/package/karma-chrome-launcher/v/3.1.0)
        -   [![karma-coverage](https://img.shields.io/badge/karma--coverage-~2.0.3-red?style=flat-square)](https://npmjs.com/package/karma-coverage/v/2.0.3)
        -   [![karma-jasmine](https://img.shields.io/badge/karma--jasmine-~4.0.0-red?style=flat-square)](https://npmjs.com/package/karma-jasmine/v/4.0.0)
        -   [![karma-jasmine-html-reporter](https://img.shields.io/badge/karma--jasmine--html--reporter-~1.5.0-red?style=flat-square)](https://npmjs.com/package/karma-jasmine-html-reporter/v/1.5.0)
        -   [![protractor](https://img.shields.io/badge/protractor-~7.0.0-red?style=flat-square)](https://npmjs.com/package/protractor/v/7.0.0)
        -   [![rxjs](https://img.shields.io/badge/rxjs-~6.6.0-red?style=flat-square)](https://npmjs.com/package/rxjs/v/6.6.0)
        -   [![zone.js](https://img.shields.io/badge/zone.js-~0.11.3-red?style=flat-square)](https://npmjs.com/package/zone.js/v/0.11.3)
