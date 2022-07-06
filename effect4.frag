VARYING vec2 center_vec;
// Invaders,Invaders, fragment shader by movAX13h, Nov.2015
vec3 iResolution = vec3(1280,720,500);
//vec3 color = vec3(0.2, 0.42, 0.68); // blue 1
//vec3 color = vec3(0.1, 0.3, 0.6); // blue 2
float time;

vec3 Dave_Hoskins_Warp_Shader(in vec2 fragCoord)
{
    float s = 0.0, v = 0.0;
    vec2 uv = (fragCoord.xy / iResolution.xy) * 2.0 - 1.0;
    float t = time*0.005;
    uv.x = (uv.x * iResolution.x / iResolution.y) + sin(t)*.5;
    float si = sin(t/2.f+2.17); // ...Squiffy rotation matrix!
    float co = cos(t/2.f);
    uv *= mat2(co, si, -si, co);
    vec3 col = vec3(0.0);
    for (int r = 0; r < 100; r++)
    {
        vec3 p= vec3(0.3, 0.2, floor(time) * 0.0008) + s * vec3(uv, 0.143);
        p.z = mod(p.z,2.0);
        for (int i=0; i < 10; i++) p = abs(p*2.04) / dot(p, p) - 0.75;
        v += length(p*p)*smoothstep(0.0, 0.5, 0.9 - s) * .002;
        col +=  vec3(v * 0.8, 1.1 - s * 0.5, .7 + v * 0.5) * v * 0.013;
        s += .01;
    }
    return col;
}
float character(float n, vec2 p) // some compilers have the word "char" reserved
{
    p = floor(p * vec2(8.0,-8.0) + (vec2(-4.0,4.0) + vec2(1.0)) );

        if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y)
        {
        //test values
        //n = -(exp2(24.)-1.0); //-(2^24-1) All bits set - a white 5x5 box

        //24 bits and a multiplier (exponent)
        //Set the highest bit and use log2 to get the exponent that could respresent that
        //adjust the mantissa and get the remaining bits


        //p = floor(p);
        float x = (5.0 * p.y + p.x);
        //x = floor(x);



        float signbit = (n < 0.0)
          ? 1.0
          : 0.0 ;

        signbit = (x == 0.0)
          ? signbit
          : 0.0 ;


        //Tenary Multiply exp2
        return ( fract( abs( n*exp2(-x-1.0))) >= 0.5) ? 1.0 : signbit; //works on AMD and intel

        }

    return 0.0;

}
void MAIN()
{
    vec2 pix = INPUT_UV.xy;
    int pixel_chunk_size = 300;
    vec3 col = texture(INPUT, trunc(INPUT_UV*pixel_chunk_size)/pixel_chunk_size).rgb;
    float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;

    float n = float[]( 0.,4194304.,131200.,324.,330.,283712.,12650880.,4532768.,
                           13191552.,10648704.,11195936.,15218734.,15255086.,15252014.,15324974.,11512810.
                         )[int(gray * 16.)];


    vec2 p = fract(INPUT_UV*iResolution.xy * 0.125);

    col = pow(col,vec3(0.55));
    col = col*character(n, p);



    vec2 fragCoord = INPUT_UV * iResolution.xy;
    time = (iTime+1.4) * 30.0;
    vec3 col2 = Dave_Hoskins_Warp_Shader(fragCoord);
//    FRAGCOLOR = vec4(col, 1.0);


    float t = 0.0;
    float b = 1.0 - 0.9;

    col2 = mix(col, col2, smoothstep(0.5, 0.99, min(0.7-b, 1.0-t))); // mix shaders
    FRAGCOLOR = vec4(col2, 1.0);
}
