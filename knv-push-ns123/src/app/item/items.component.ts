import { Component, OnInit } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { Push } from "kinvey-nativescript-sdk/push";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./items.component.html",
})

export class ItemsComponent implements OnInit {
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Initialize Kinvey.
        Kinvey.init({
            appKey: 'xxx',
            appSecret: 'xxx'
        });

        // Test connection.
        Kinvey.ping()
            .then((response) => {
                console.log(`Kinvey Ping Success. Kinvey Service is alive, version: ${response.version}, response: ${response.kinvey}`);
            })
            .catch((error) => {
                console.log(`Kinvey Ping Failed. Response: ${JSON.stringify(error)}`);
            });

        // Check for an active user.    
        const activeUser = Kinvey.User.getActiveUser();
        if (!activeUser) {
            Kinvey.User.login('xxx', 'xxx')
                .then((user: Kinvey.User) => {
                    this.registerPushNotifications();
                })
                .catch((error: Kinvey.BaseError) => {
                    console.log(`Kinvey login Failed. Response: ${JSON.stringify(error)}`);
                });
        } else {
            this.registerPushNotifications();
        }
    }

    registerPushNotifications() {
        Push.register({
            android: {
                senderID: '765209267254'
            },
            ios: {
                alert: true,
                badge: true,
                sound: true,
                interactiveSettings: {
                    actions: [{
                        identifier: 'READ_IDENTIFIER',
                        title: 'Read',
                        activationMode: "foreground",
                        destructive: false,
                        authenticationRequired: true
                    }, {
                        identifier: 'CANCEL_IDENTIFIER',
                        title: 'Cancel',
                        activationMode: "foreground",
                        destructive: true,
                        authenticationRequired: true
                    }],
                    categories: [{
                        identifier: 'READ_CATEGORY',
                        actionsForDefaultContext: ['READ_IDENTIFIER', 'CANCEL_IDENTIFIER'],
                        actionsForMinimalContext: ['READ_IDENTIFIER', 'CANCEL_IDENTIFIER']
                    }]
                },
            },
            notificationCallback: (message: any) => {
                alert("Push Notifications Message: " + JSON.stringify(message));
            }
        })
            .then((deviceToken: string) => {
                alert("Push Notifications Device Token: " + JSON.stringify(deviceToken));
            })
            .catch((error: Error) => {
                alert("Push Notifications Error. Please check logs!");
                console.error("Push Notifications Error: " + JSON.stringify(error));
            });
    }
}
