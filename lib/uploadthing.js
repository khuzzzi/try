import { ourFileRouter } from "@/app/api/webhook/clerk/uploadthing/core";
import {
 
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
  import { generateReactHelpers } from "@uploadthing/react";
  // import { OurFileRouter } from "@/app/api/uploadthing/core";
  
  export const UploadButton = generateUploadButton();
  export const UploadDropzone = generateUploadDropzone();
  export const {useUploadThing,uploadFiles} = generateReactHelpers(ourFileRouter)