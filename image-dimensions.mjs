// Read bounded headers before browser image decoding can allocate pixel buffers.
const LIMIT=20_000_000,HEADER=1024*1024;
const ascii=(b,p,n)=>String.fromCharCode(...b.subarray(p,p+n));
const u16=(b,p,le=false)=>le?b[p]+b[p+1]*256:b[p]*256+b[p+1];
const u24=(b,p)=>b[p]+b[p+1]*256+b[p+2]*65536;
const u32=(b,p,le=false)=>le?(b[p]+b[p+1]*256+b[p+2]*65536+b[p+3]*16777216):(b[p]*16777216+b[p+1]*65536+b[p+2]*256+b[p+3]);
export function checkImageDimensions(data,mime){
 const b=data.subarray(0,HEADER);let width,height;
 if(mime==='image/png'&&b.length>=24&&[137,80,78,71,13,10,26,10].every((x,i)=>b[i]===x)&&u32(b,8)===13&&ascii(b,12,4)==='IHDR'){width=u32(b,16);height=u32(b,20);}
 else if(mime==='image/jpeg'&&b.length>=4&&b[0]===255&&b[1]===216){let p=2;while(p+4<=b.length){if(b[p++]!==255)break;while(b[p]===255)p++;const marker=b[p++];if(marker===217||marker===218)break;if(marker===1||(marker>=208&&marker<=215))continue;if(p+2>b.length)break;const len=u16(b,p);if(len<2||p+len>b.length)break;if([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)){if(len<7)break;height=u16(b,p+3);width=u16(b,p+5);break;}p+=len;}}
 else if(mime==='image/webp'&&b.length>=20&&ascii(b,0,4)==='RIFF'&&ascii(b,8,4)==='WEBP'){let p=12;while(p+8<=b.length){const tag=ascii(b,p,4),len=u32(b,p+4,true),d=p+8;if(tag==='VP8X'&&len>=10&&d+10<=b.length){width=1+u24(b,d+4);height=1+u24(b,d+7);break;}if(tag==='VP8L'&&len>=5&&d+5<=b.length&&b[d]===47){width=1+b[d+1]+((b[d+2]&63)<<8);height=1+(b[d+2]>>6)+(b[d+3]<<2)+((b[d+4]&15)<<10);break;}if(tag==='VP8 '&&len>=10&&d+10<=b.length&&b[d+3]===157&&b[d+4]===1&&b[d+5]===42){width=u16(b,d+6,true)&16383;height=u16(b,d+8,true)&16383;break;}if(len>b.length-d)break;p=d+len+(len%2);}}
 if(!Number.isSafeInteger(width)||!Number.isSafeInteger(height)||width<1||height<1)throw Error('Image dimensions could not be safely checked.');
 if(width*height>LIMIT)throw Error('Image is too large to edit (maximum 20 megapixels).');
 return {width,height};
}
