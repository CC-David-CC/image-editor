/** Filerobot is packaged entirely in this app. File access belongs to the host. */
import React,{useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import FilerobotImageEditor from 'react-filerobot-image-editor';
import './image-editor.css';
const h=React.createElement;
const mimeFor=path=>/\.png$/i.test(path)?'image/png':/\.jpe?g$/i.test(path)?'image/jpeg':/\.webp$/i.test(path)?'image/webp':null;
const imageDataURL=(data,mime)=>{let raw='';for(let i=0;i<data.length;i+=8192)raw+=String.fromCharCode(...data.subarray(i,i+8192));return 'data:'+mime+';base64,'+btoa(raw);};
const validateImage=src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>img.naturalWidth*img.naturalHeight<=20000000?resolve():reject(Error('Image is too large to edit (maximum 20 megapixels).'));img.onerror=()=>reject(Error('This image could not be decoded.'));img.src=src;});
const canvasBlob=(canvas,mime)=>new Promise((resolve,reject)=>{if(!(canvas instanceof HTMLCanvasElement))return reject(Error('The edited image is unavailable.'));canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Could not encode the image.')),mime,0.92);});
function ImageView({host}){
 const {w,desktop}=host,{mirrorFileContext,signedInSubject}=host.storage,launch=w.launchContext,owner=launch?.owner||signedInSubject();
 const state=w.imageEditor??={path:launch?.path||'',version:null,dirty:false,edits:0};
 const [sourcePath,setSourcePath]=useState(launch?.path||''),[url,setURL]=useState(''),[message,setMessage]=useState(launch?'Opening image…':'Open an image from Files.'),alive=useRef(true),busy=useRef(false),unsubscribe=useRef(()=>{});
 useEffect(()=>{alive.current=true;let cancelled=false;if(!sourcePath)return ()=>{cancelled=true;alive.current=false;};
  (async()=>{try{state.path=sourcePath;state.version=null;setURL('');setMessage('Opening image…');const c=await mirrorFileContext(),mime=mimeFor(state.path);if(!mime)throw Error('Open a PNG, JPEG or WebP image.');const file=await c.files.read(state.path);if(cancelled||!alive.current||host.signal.aborted||!c.valid())return;const dataURL=imageDataURL(file.data,mime);await validateImage(dataURL);if(cancelled||!alive.current||host.signal.aborted||!c.valid())return;state.version=file.version;setURL(dataURL);setMessage(file.status==='conflict'?'This image has conflicting copies. Resolve them in Files.':'Ready.');
   unsubscribe.current=c.files.subscribe(async()=>{if(!alive.current||busy.current||!state.version)return;const expected=state.version;try{const newer=await c.files.read(state.path);if(alive.current&&!busy.current&&state.version===expected&&(newer.version!==expected||newer.status==='conflict'))setMessage('The saved image changed. Your edits are still open; check Files before saving.');}catch{if(alive.current&&!busy.current)setMessage('The saved image is no longer available. Your edits are still open.');}});
  }catch(error){if(!cancelled&&alive.current)setMessage(error.message);}})();
  return ()=>{cancelled=true;alive.current=false;unsubscribe.current();};
 },[host,sourcePath,state]);
 async function save(image){if(busy.current||!alive.current)return;busy.current=true;const editVersion=state.edits;setMessage('Saving on this device…');try{const c=await mirrorFileContext(),mime=mimeFor(state.path),blob=await canvasBlob(image.imageCanvas,mime);if(blob.type!==mime)throw Error('This browser cannot save the image in its original format.');if(blob.size>8*1024*1024)throw Error('Edited images are limited to 8 MiB.');const bytes=new Uint8Array(await blob.arrayBuffer());if(!alive.current||host.signal.aborted||!c.valid())return;const result=await c.files.write(state.path,bytes,state.version);if(!alive.current||!c.valid())return;state.version=result.version;state.dirty=state.edits!==editVersion;setMessage(state.dirty?'Saved earlier edits; newer changes are unsaved.':'Saved on this device; syncing with server…');}catch(e){if(alive.current)setMessage(e.message);}finally{busy.current=false;}}
 const browse=async()=>{if(state.dirty&&!confirm('Discard unsaved edits and open another image?'))return;const selected=await host.storage.pickFile({extensions:['.png','.jpg','.jpeg','.webp'],signal:host.signal});if(selected&&alive.current){state.dirty=false;setSourcePath(selected);}};
 if(!sourcePath)return h('div',{className:'image-editor-welcome'},h('p',null,message),h('button',{type:'button',onClick:browse},'Browse My files'));
 return h(React.Fragment,null,h('button',{type:'button',onClick:browse},'Browse My files'),h('div',{className:'image-editor-stage'},url&&h(FilerobotImageEditor,{source:url,useBackendTranslations:false,useCloudimage:false,onBeforeSave:()=>false,onSave:save,onModify:()=>{state.dirty=true;state.edits++;},savingPixelRatio:1,defaultSavedImageType:mimeFor(state.path).split('/')[1],observePluginContainerSize:true})),h('div',{className:'app-status','aria-live':'polite'},message));
}
export function mount(host){const element=host.ui.make('div','window-content image-editor-content'),root=createRoot(element);root.render(h(ImageView,{host}));return {element,dispose(){root.unmount();}};}
