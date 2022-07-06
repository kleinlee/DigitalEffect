VARYING vec2 center_vec;
// Invaders,Invaders, fragment shader by movAX13h, Nov.2015

//vec3 color = vec3(0.2, 0.42, 0.68); // blue 1
//vec3 color = vec3(0.1, 0.3, 0.6); // blue 2
vec3 color = vec3(0.6, 0.1, 0.3); // red
//vec3 color = vec3(0.1, 0.6, 0.3); // green
vec3 iResolution = vec3(1280,720,500);
//float iTime = 1.0f;
float rand(float x) { return fract(sin(x) * 4358.5453123); }
float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5357); }

float invader(vec2 p, float n)
{
    p.x = abs(p.x);
    p.y = floor(p.y - 5.0);
    return step(p.x, 2.0) * step(1.0, floor(mod(n/(exp2(floor(p.x - 3.0*p.y))),2.0)));
}

float ring(vec2 uv, float rnd)
{
    float t = 0.6*(iTime+0.2*rnd);
    float i = floor(t/2.0);
    vec2 pos = 2.0*vec2(rand(i*0.123), rand(i*2.371))-1.0;
    return smoothstep(0.2, 0.0, abs(length(uv-pos)-mod(t,2.0)));
}

//void MAIN()
//{
//    float radius = 0.25;
//    float dist_to_center = length(center_vec) / radius;
//    vec2 texcoord = INPUT_UV;

//    float num_ = 300.f;
//    float frac_x = fract(texcoord.x * num_);
//    float frac_y = fract(texcoord.y * num_);

//    if (frac_x < 0.1f || frac_x > 0.9f || frac_y < 0.1f || frac_y > 0.9f)
//    {
//        FRAGCOLOR = vec4(0,0,0,1);
//        return;
//    }


//    float x = floor(texcoord.x * num_) / num_;
//    float y = floor(texcoord.y * num_) / num_;
////    float x = (int)(texcoord.x * 4.f) / 4.f;
////    float y = (int)(texcoord.y * 4.f) / 4.f;
//    texcoord = vec2(x, y);
//    vec4 c = texture(INPUT, texcoord);
//    c.r *= uRed;
//    c.g *= uGreen;
//    FRAGCOLOR = c;
//}



//void MAIN()
//{
//    vec2 p = INPUT_UV;
//    vec2 uv = p / iResolution.xy - 0.5;
//    p.y += 120.0*iTime;
//    float r = rand(floor(p/8.0));
//    vec2 ip = mod(p,8.0)-4.0;

//    float a = -0.3*smoothstep(0.1, 0.8, length(uv)) +
//        invader(ip, 809999.0*r) * (0.06 + 0.3*ring(uv,r) + max(0.0, 0.2*sin(10.0*r*iTime)));

//    FRAGCOLOR = vec4(color+a, 1.0);
//}

//void MAIN()
//{
//    vec2 uv = trunc(INPUT_UV*400)/400.;
//    vec4 o = texture(INPUT, uv);
//    FRAGCOLOR = o * texture(tex222, INPUT_UV*150./20. + vec2( -14.*o.r, 13 ) / 2. ).r;
////    FRAGCOLOR = texture(INPUT, ceil(INPUT_UV/2.)*2.);
////    FRAGCOLOR *= texture(tex222, mod(INPUT_UV,8.)/171. + vec2( -14.*FRAGCOLOR.r, 13 ) / 16. ).r;
//}
//float character(int n, vec2 p)
//{
//    if (n == 4096)
//    {
//        return 0.f;
//    }
//    p = floor(p*vec2(4.0, -4.0) + 2.5);
//    if (clamp(p.x, 0.0, 4.0) == p.x)
//        {
//        if (clamp(p.y, 0.0, 4.0) == p.y)
//        {
//            int a = int(round(p.x) + 5.0 * round(p.y));
//            if (((n >> a) & 1) == 1)
//                return 1.0;
//        }
//    }
//    return 0.0;
//}
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

//    col = mix(vec3(character(n, p)),col, 1.0);

    FRAGCOLOR = vec4(col,1.0);


//    int n =  4096;                // .
//    if (gray > 0.2) n = 65600;    // :
//    if (gray > 0.3) n = 332772;   // *
//    if (gray > 0.4) n = 15255086; // o
//    if (gray > 0.5) n = 23385164; // &
//    if (gray > 0.6) n = 15252014; // 8
//    if (gray > 0.7) n = 13199452; // @
//    if (gray > 0.8) n = 11512810; // #

//    vec2 p = mod(pix*pixel_chunk_size, 2.0) - vec2(1.0);

//    col = col*character(n, p);

//    FRAGCOLOR = vec4(col, 1.0);
}
