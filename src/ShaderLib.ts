/**
 * Created by hey on 2017/2/28.
 */

namespace HEY.ShaderLib{

    export let v_default:string =
            `#version 300 es
            layout (location = 0) in vec3 position;
            
            uniform mat4 model;
            uniform mat4 view;
            uniform mat4 projection;
            
            void main()
            {
                 gl_Position = projection*view*model*vec4(position, 1.0);
            }
        `;

    export let f_default:string =
            `#version 300 es
            precision highp float;
            out vec4 color;
            
            uniform vec3 col;
            
            void main()
            {
                color = vec4(col, 1.0f);
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
                vec4 texColor = texture(ourTexture,texCoord*10.);
                
                color = texColor;
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
                color = texture(ourTexture,texCoord);
                // float depth = LinearizeDepth(gl_FragCoord.z) /1.;
                // color = vec4(vec3(depth),1.);
            }

        `;

    export let f_flat:string =
        `#version 300 es
        precision highp float;
        out vec4 color;    
        in vec2 texCoord;
        void main(){
          color = vec4(.5,.5,0.,1.);
        }
        `;

    export let v_screen:string =
        `#version 300 es
            
            layout(location = 0) in vec3 position;
            layout(location = 1) in vec2 uv;
            
            out vec2 texCoord;
            void main(){
               gl_Position = vec4(position,1.);
               texCoord = uv;
            }
        `;

    export let f_screen:string =
        `#version 300 es
        precision highp float;
        out vec4 color;    
        in vec2 texCoord;
        
        uniform sampler2D texture0;
        
        const float offset = 1.0 / 300.;  

        void main()
        {
            vec2 offsets[9] = vec2[](
                vec2(-offset, offset),  // top-left
                vec2(0.0f,    offset),  // top-center
                vec2(offset,  offset),  // top-right
                vec2(-offset, 0.0f),    // center-left
                vec2(0.0f,    0.0f),    // center-center
                vec2(offset,  0.0f),    // center-right
                vec2(-offset, -offset), // bottom-left
                vec2(0.0f,    -offset), // bottom-center
                vec2(offset,  -offset)  // bottom-right    
            );
        
            float kernel[9] = float[](
                1., 1., 1.,
                1.,  -8., 1.,
                1., 1., 1.
            );
            
            // kernel = float[](
            //     1.0 / 16., 2.0 / 16., 1.0 / 16.,
            //     2.0 / 16., 4.0 / 16., 2.0 / 16.,
            //     1.0 / 16., 2.0 / 16., 1.0 / 16.  
            // );
            
            vec3 sampleTex[9];
            for(int i = 0; i < 9; i++)
            {
                sampleTex[i] = vec3(texture(texture0, texCoord.st + offsets[i]));
            }
            vec3 col = vec3(0.0);
            for(int i = 0; i < 9; i++)
                col += sampleTex[i] * kernel[i];
            
            color = vec4(col, 1.0);
        }  
        `;

        export let v_skybox:string =
            `#version 300 es
                layout(location = 0) in vec3 position;
                
                out vec3 texCoords;
                uniform mat4 projection;
                uniform mat4 view;
                void main(){
                    vec4 pos = projection*view*vec4(position,1.);
                    gl_Position = pos.xyww;
                    texCoords = position;
                }
            `;

        export let f_skybox:string =
            `#version 300 es
            precision highp float;
            in vec3 texCoords;
            out vec4 color;
            uniform samplerCube skybox;
            
            void main(){
                color = texture(skybox,texCoords);
                // color = vec4(1.,1.,0.,1.);
            }
            `;

        export let v_assimp:string =
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

        export let f_assimp:string =
            `#version 300 es
            precision highp float;
            uniform sampler2D map;

            in vec2 texCoord;
            
            out vec4 color;
            
            void main(){
                vec3 diff  = texture(map,texCoord).rgb;
                diff = pow(abs(diff),vec3(1.3));
                color = vec4(diff,1.);
            }
            `;


}