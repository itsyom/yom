/**
 * Created by hey on 2017/2/28.
 */

namespace HEY.ShaderLib{

    export let v_default:string =
            `#version 300 es
            layout (location = 0) in vec3 position;
            void main()
            {
                 gl_Position = vec4(position.x, position.y, position.z, 1.0);
            }
        `;

    export let f_default:string =
            `#version 300 es
            precision highp float;
            out vec4 color;
            
            void main()
            {
                color = vec4(1.0f, 0.5f, 0.2f, 1.0f);
            }
    `;


    export let v_rectangle:string =
        `#version 300 es
         layout (location = 0) in vec3 position;
         layout (location = 1) in vec3 color;
         layout (location = 2) in vec2 uv;
         
         uniform mat4 model;
         uniform mat4 view;
         uniform mat4 projection;
                  
         out vec3 ourColor;
         out vec2 texCoord;
         void main(){
            gl_Position = projection*view*model*vec4(position,1.);
            ourColor = vec3(color);
            texCoord = uv;
         }
        `;

    export let f_rectangle:string =
        `#version 300 es
            precision highp float;
            out vec4 color;
            
            in vec3 ourColor;
            in vec2 texCoord;
            
            uniform sampler2D ourTexture; 
            
            void main()
            {
                color = vec4(ourColor, 1.0f);
                color = texture(ourTexture,texCoord);
            }

        `;

    export let v_box:string =
        `#version 300 es
         
         layout(location = 0) in vec3 position;   
         layout(location = 1) in vec2 uv;
         
         uniform mat4 model;
         uniform mat4 view;
         uniform mat4 projection;
                  
         out vec2 texCoord;
         void main(){
            gl_Position = projection*view*model*vec4(position,1.);
            texCoord = uv;
         }
        `;

    export let f_box:string =
        `#version 300 es
            precision highp float;
            out vec4 color;
            
            in vec2 texCoord;
            
            uniform sampler2D ourTexture; 
            
            float LinearizeDepth(float depth)
            {
                float near = 0.1;
                float far = 500.0;
                float z = depth * 2.0 - 1.0; // Back to NDC
                return (2.0 * near) / (far + near - z * (far - near));
            }
            
            void main()
            {
                // color = texture(ourTexture,texCoord);
                float depth = LinearizeDepth(gl_FragCoord.z) /1.;
                color = vec4(vec3(depth),1.);
            }

        `;

}