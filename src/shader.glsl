varying vec2 vTextureCoord;//The coordinates of the current pixel
uniform sampler2D uSampler;//The image data
const float PI = 3.1415;
uniform vec4 filterArea;

uniform float xRotate;
uniform float yRotate;
uniform float zRotate;

vec2 mapCoord( vec2 coord )
{
    coord *= filterArea.xy;
    coord += filterArea.zw;
    coord /= 512.0;

    return coord;
}

vec2 unmapCoord( vec2 coord )
{
    coord *= 512.0;
    coord -= filterArea.zw;
    coord /= filterArea.xy;

    return coord;
}

mat3 xRotation(float angle){
	mat3 rotOut = mat3(1);
    
    rotOut[1] = vec3(0, cos(angle), sin(angle));
    rotOut[2] = vec3(0, -sin(angle), cos(angle));
    
    return rotOut;
}

mat3 yRotation(float angle){
	mat3 rotOut = mat3(1);
    
    rotOut[0] = vec3(cos(angle), 0, sin(angle));
    rotOut[2] = vec3(-sin(angle), 0, cos(angle));
    
    return rotOut;
}

mat3 zRotation(float angle){
	mat3 rotOut = mat3(1);
    
    rotOut[0] = vec3(cos(angle), -sin(angle), 0);
    rotOut[1] = vec3(sin(angle), cos(angle), 0);
    
    return rotOut;
}

void main(){
    //Set middle as middle point
    vec2 uv = mapCoord(vTextureCoord) - vec2(0.5, 0.5);
    uv.y = -uv.y;
    uv *= 2.0;
    
    vec3 higher = vec3(uv, 0);
    higher.z = -sqrt(1.0-higher.x*higher.x-higher.y*higher.y);

    higher = zRotation(zRotate)*yRotation(yRotate)*xRotation(xRotate)*higher;

    float yaw = (atan(higher.x, higher.y)/PI+1.0)/2.0;
    float pitch = (asin(higher.z/length(higher))/(PI/2.0)+1.0)/2.0;
    vec2 uv2 = vec2(yaw, pitch);
    uv2 = unmapCoord(uv2);
    //gl_FragColor = vec4(uv2, 0, 1);
    gl_FragColor = texture2D(uSampler, uv2);
}