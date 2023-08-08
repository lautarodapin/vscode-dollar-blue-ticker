// Copyright (c) Robert Calvert. Licensed under the MIT license.
// See LICENSE file in the project root for full license information.

import fetch from 'node-fetch';
import * as vscode from 'vscode';

// the web request handler


// represents a ticker object
export class Ticker {
    // the tickers status bar item
    item: vscode.StatusBarItem;

    // the definition properties
    interval: number;

    higherColor: string = "lightgreen";
    lowerColor: string = "coral";

    lastAvgPrice: number | undefined;


    // construct a new ticker based on a ticker definition
    constructor(config?: TickerConfiguration) {
        // set the definition properties
        this.item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
        this.interval = config?.interval || 60;
        // handle the first refresh call
        this.refresh();
    }

    // dispose of the ticker
    dispose() {
        // hide and dispose the status bar item
        this.item.hide();
        this.item.dispose();
    }

    // refresh the ticker
    refresh() {
        (async () => {
            try {
                // get the 'base' service URL
                let url = `https://api.bluelytics.com.ar/v2/latest`;

                const object = await fetch(url).then(response => response.json() as unknown as JsonResponse);

                // set the status bar item text using the template
                this.item.text = `Dolar: ${object.blue.value_sell} - ${new Date(object.last_update).toLocaleDateString("es-ar", { month: "short", day: "numeric", hour: "numeric", minute: "numeric" })}`;

                if (this.lastAvgPrice && this.lastAvgPrice > object.blue.value_avg) {
                    this.item.color = this.lowerColor;
                } else if (this.lastAvgPrice) {
                    this.item.color = this.higherColor;
                }

                // make sure the status bar item is visible
                this.item.show();

            } catch (error) {
                if (error instanceof Error) {
                    // log the error and hide the status bar item
                    console.log(error.message);
                }
                this.item.hide();
            }
        })();

    }

}

interface JsonResponse {
    oficial: Dollar
    blue: Dollar
    oficial_euro: Dollar
    blue_euro: Dollar
    last_update: string
}

interface Dollar {
    value_avg: number
    value_sell: number
    value_buy: number
}

export interface TickerConfiguration {
    interval: number
}