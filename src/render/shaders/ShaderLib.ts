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
            
            layout(location = 0) in vec2 position;
            layout(location = 1) in vec2 uv;
            
            
            uniform mat4 model;
            
            out vec2 texCoord;
            void main(){
               gl_Position = model*vec4(position,1.,1.);
               texCoord = uv;
            }
        `;

    export let f_screen:string =
        `#version 300 es
        precision highp float;
        out vec4 color;    
        in vec2 texCoord;
        
        uniform sampler2D diffuse;
        
        const float offset = 1.0 / 300.;  

        void main()
        {
            vec3 col = texture(diffuse,texCoord).rgb;
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
            uniform vec3 ambient;
            

            in vec2 texCoord;
            
            out vec4 color;
            
            void main(){
                vec3 diff  = texture(map,texCoord).rgb;
                
                diff = diff*ambient;
                
                diff = pow(abs(diff),vec3(1.));
                color = vec4(diff,1.);
            }
            `;

    export let v_phongAssimp:string =
        `#version 300 es
            
            layout(location = 0) in vec3 position;
            layout(location = 1) in vec2 uv;
            layout(location = 2) in vec3 normal;
            
            uniform mat4 model;
            uniform mat4 view;
            uniform mat4 projection;
            
            
            out vec2 texCoord;
            out vec3 Normal;
            out vec3 fragPos;
            
            void main(){
                gl_Position = projection*view*model*vec4(position,1.);
                
                texCoord = uv;
                fragPos = vec3(model*vec4(position,1.));
                Normal = mat3(transpose(inverse(model))) * normal;
            }
            
            `;

        export let f_phongAssimp:string =
            `#version 300 es
            precision highp float;
            
            uniform sampler2D map;
            uniform vec3 ambient;
            uniform vec3 lightPos;
            
            
            
            vec3 lightColor = vec3(2.);
            
            in vec3 Normal;
            in vec3 fragPos;
            in vec2 texCoord;
            out vec4 color;
            
            void main(){
                
                vec3 lightDir = normalize(lightPos-fragPos);
                vec3 Normal = normalize(Normal);
                float d = dot(lightDir,Normal);
                
                vec3 diffuse = max(lightColor*d,0.);
                
                vec3 eyeDir = normalize(lightPos-fragPos);
                vec3 ref = reflect(-lightDir,Normal);
                float spec = pow(max(dot(eyeDir,ref),0.),20.); 
                
                vec3 specCol = lightColor*spec*0.5;
                               
                
                vec3 col  = texture(map,texCoord).rgb;
                col = (ambient+diffuse+specCol)*col;
                color = vec4(pow(abs(col),vec3(1.)),1.);
            }
            
            
            `;


}