/**
 * Created by hey on 2017/3/26.
 */

namespace HEY{

    export class EventListener{
        constructor(){

        }

        setup(){
            DOMEventDispatcher.getInstance().addEventListener(this);
        }

        onMouseDown(e:MouseEvent){

        }

        onMouseMove(e:MouseEvent){

        }

        onMouseUp(e:MouseEvent){

        }
    }
}