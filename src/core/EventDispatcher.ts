/**
 * Created by ll on 2017/5/17.
 */


namespace HEY{


    type Listener = (target:any)=>void;

    export class EventDispatcher {

        listeners: { [key: string]: Listener[] } = null;

        constructor() {

        }

        addEventListener(type: string, listener: Listener) {
            if (!listener) return;
            if (this.listeners[type] === undefined) {
                this.listeners[type] = [];
            }

            if(this.listeners[type].indexOf(listener) === -1){
                this.listeners[type].push(listener);
            }
        }

        hasEventListener ( type:string, listener:Listener ) {

            if ( this.listeners === undefined ) return false;

            let listeners = this.listeners;

            return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

        }

        removeEventListener ( type:string, listener:Listener ) {

            if ( this.listeners === undefined ) return;

            var listeners = this.listeners;
            var listenerArray = listeners[ type ];

            if ( listenerArray !== undefined ) {

                var index = listenerArray.indexOf( listener );

                if ( index !== - 1 ) {

                    listenerArray.splice( index, 1 );

                }

            }

        }

        dispatchEvent ( event:any ) {

            if ( this.listeners === undefined ) return;

            var listeners = this.listeners;
            var listenerArray = listeners[ event.type ];

            if ( listenerArray !== undefined ) {

                event.target = this;

                var array = [], i = 0;
                var length = listenerArray.length;

                for ( i = 0; i < length; i ++ ) {

                    array[ i ] = listenerArray[ i ];

                }

                for ( i = 0; i < length; i ++ ) {

                    array[ i ].call( this, event );

                }

            }

        }


    }
}
